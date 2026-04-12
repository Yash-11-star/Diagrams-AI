import streamlit as st
import requests
import json
import base64
import os

BACKEND = os.environ.get("BACKEND_URL", "http://backend:8000")

st.set_page_config(
    page_title="Agentic Figure Drawing",
    page_icon="🗂️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ──────────────────────────────────────────────────────────────
st.markdown("""
<style>
  [data-testid="stAppViewContainer"] { background: #0f1117; }
  [data-testid="stSidebar"] { background: #1a1d27; }
  h1 { color: #4fa3ff; font-family: 'Segoe UI', sans-serif; }
  h2, h3 { color: #c9d1d9; }
  .variant-card {
    background: #1e2130;
    border: 1px solid #30363d;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .selected-card {
    border: 2px solid #4fa3ff !important;
    background: #1a2744 !important;
  }
  .badge {
    display: inline-block;
    background: #4fa3ff22;
    color: #4fa3ff;
    border-radius: 6px;
    padding: 2px 10px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .stat-box {
    background: #1e2130;
    border-radius: 8px;
    padding: 10px 16px;
    text-align: center;
  }
  .mermaid-block {
    background: #161b22;
    border-radius: 8px;
    padding: 12px;
    font-family: monospace;
    font-size: 12px;
    color: #c9d1d9;
    overflow-x: auto;
    white-space: pre;
  }
</style>
""", unsafe_allow_html=True)

# ── Session state ────────────────────────────────────────────────────────────
for key, default in [
    ("variants", []),
    ("selected_idx", None),
    ("selected_diagram", None),
    ("edit_history", []),
    ("mermaid_code", ""),
    ("drawio_xml", ""),
]:
    if key not in st.session_state:
        st.session_state[key] = default


# ── Helpers ──────────────────────────────────────────────────────────────────
def api(path, payload=None, method="post"):
    url = f"{BACKEND}{path}"
    try:
        if method == "get":
            r = requests.get(url, timeout=10)
        else:
            r = requests.post(url, json=payload, timeout=60)
        r.raise_for_status()
        return r.json()
    except requests.exceptions.ConnectionError:
        st.error("⚠️ Cannot reach backend. Is Docker running?")
        return None
    except Exception as e:
        st.error(f"API error: {e}")
        return None


def diagram_stats(d):
    nodes = d.get("nodes", [])
    edges = d.get("edges", [])
    types = {}
    for n in nodes:
        types[n["type"]] = types.get(n["type"], 0) + 1
    return len(nodes), len(edges), types


def mermaid_preview(code: str):
    """Render Mermaid diagram via mermaid.ink as an image."""
    encoded = base64.urlsafe_b64encode(code.encode()).decode()
    url = f"https://mermaid.ink/img/{encoded}?type=png&bgColor=1e2130"
    st.image(url, use_container_width=True)


def render_node_table(diagram):
    nodes = diagram.get("nodes", [])
    if not nodes:
        return
    cols = st.columns([2, 3, 2])
    cols[0].markdown("**ID**")
    cols[1].markdown("**Label**")
    cols[2].markdown("**Type**")
    st.divider()
    for n in nodes[:12]:  # cap for display
        c = st.columns([2, 3, 2])
        c[0].code(n["id"], language=None)
        c[1].write(n["label"])
        c[2].write(f"`{n['type']}`")
    if len(nodes) > 12:
        st.caption(f"… and {len(nodes)-12} more nodes")


# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🗂️ Agentic Figure Drawing")
    st.caption("ECE 595 · Group 3 · Purdue University")
    st.divider()

    st.markdown("### ⚙️ Settings")
    num_variants = st.slider("Number of variants", 1, 3, 2)
    st.divider()

    # Health check
    if st.button("🔌 Check backend"):
        resp = api("/health", method="get")
        if resp:
            st.success("Backend is online ✅")

    st.divider()
    st.markdown("### 📖 How it works")
    st.markdown("""
1. **Describe** your diagram in plain English
2. **Generate** — the LLM produces JSON IR variants
3. **Select** a variant to work with
4. **Edit** using natural language (Phase 2)
5. **Export** to Mermaid or draw.io XML
""")


# ── Main layout ───────────────────────────────────────────────────────────────
st.markdown("# 🗂️ Agentic Figure Drawing")
st.markdown("*Generate fully editable diagrams from natural-language descriptions.*")
st.divider()

tab_gen, tab_edit, tab_export = st.tabs(["🧠 Generate", "✏️ Edit", "📤 Export"])

# ══════════════════════════════════════════════════════════════════════════════
# TAB 1 — GENERATE
# ══════════════════════════════════════════════════════════════════════════════
with tab_gen:
    st.markdown("### Describe your diagram")
    examples = [
        "Select an example…",
        "Create a simple login authentication flowchart",
        "Design a hospital triage process with urgent, non-urgent, and emergency branches",
        "Generate a CI/CD pipeline from code commit to production deployment",
        "Create a software development lifecycle with a cyclic maintenance loop",
        "Build a university admission workflow with eligibility check and interview",
        "Create a supply chain: procurement → manufacturing → QA → distribution → retail",
    ]
    chosen = st.selectbox("Quick examples", examples, label_visibility="collapsed")
    prompt_val = "" if chosen == examples[0] else chosen

    prompt = st.text_area(
        "Enter your diagram description",
        value=prompt_val,
        height=100,
        placeholder="e.g. Create a login flowchart with retry logic...",
    )

    if st.button("⚡ Generate Variants", type="primary", use_container_width=True):
        if not prompt.strip():
            st.warning("Please enter a diagram description.")
        else:
            with st.spinner(f"Generating {num_variants} variant(s) with Gemini…"):
                result = api("/generate", {"prompt": prompt, "num_variants": num_variants})
            if result:
                st.session_state.variants = result["variants"]
                st.session_state.selected_idx = None
                st.session_state.selected_diagram = None
                st.session_state.mermaid_code = ""
                st.session_state.drawio_xml = ""
                st.session_state.edit_history = []
                st.success(f"✅ Generated {len(result['variants'])} variant(s)!")

    # Display variants
    if st.session_state.variants:
        st.divider()
        st.markdown("### Choose a variant")
        cols = st.columns(len(st.session_state.variants))
        for i, (col, variant) in enumerate(zip(cols, st.session_state.variants)):
            with col:
                n_nodes, n_edges, types = diagram_stats(variant)
                is_selected = st.session_state.selected_idx == i
                card_class = "variant-card selected-card" if is_selected else "variant-card"
                st.markdown(f"""
                <div class="{card_class}">
                  <div class="badge">Variant {i+1}</div>
                  <p style="color:#8b949e;font-size:13px;margin:4px 0">
                    {n_nodes} nodes &bull; {n_edges} edges
                  </p>
                </div>""", unsafe_allow_html=True)

                if st.button(f"{'✅ Selected' if is_selected else '👆 Select'} Variant {i+1}",
                             key=f"sel_{i}", use_container_width=True,
                             type="primary" if is_selected else "secondary"):
                    st.session_state.selected_idx = i
                    st.session_state.selected_diagram = json.loads(json.dumps(variant))
                    st.session_state.edit_history = [json.loads(json.dumps(variant))]
                    st.session_state.mermaid_code = ""
                    st.session_state.drawio_xml = ""
                    st.rerun()

                with st.expander("Raw JSON IR"):
                    st.json(variant)

        # Preview selected variant
        if st.session_state.selected_diagram is not None:
            st.divider()
            sel = st.session_state.selected_diagram
            st.markdown(f"### 👁️ Preview — Variant {st.session_state.selected_idx + 1}")

            with st.spinner("Rendering Mermaid preview…"):
                m = api("/export/mermaid", sel)
            if m:
                st.session_state.mermaid_code = m["mermaid"]
                mermaid_preview(m["mermaid"])
                with st.expander("Mermaid source"):
                    st.code(m["mermaid"], language="text")

            st.markdown("#### Node table")
            render_node_table(sel)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 2 — EDIT
# ══════════════════════════════════════════════════════════════════════════════
with tab_edit:
    if st.session_state.selected_diagram is None:
        st.info("👈 Generate and select a variant first.")
    else:
        st.markdown("### ✏️ Modify your diagram")
        st.caption("Describe what you want to change in plain English.")

        edit_examples = [
            "Select an example edit…",
            "Add an error handling node after the process step",
            "Add a retry loop from the failure node back to the start",
            "Split the process node into two sequential steps",
            "Add an admin approval decision node before the final step",
            "Remove all queue nodes and connect directly",
        ]
        chosen_edit = st.selectbox("Quick edits", edit_examples, label_visibility="collapsed", key="edit_ex")
        edit_val = "" if chosen_edit == edit_examples[0] else chosen_edit

        instruction = st.text_area(
            "Modification instruction",
            value=edit_val,
            height=80,
            placeholder="e.g. Add a timeout node after the authentication step...",
        )

        col1, col2 = st.columns([3, 1])
        with col1:
            if st.button("🔧 Apply Edit", type="primary", use_container_width=True):
                if not instruction.strip():
                    st.warning("Enter a modification instruction.")
                else:
                    with st.spinner("Applying edit with Gemini…"):
                        result = api("/edit", {
                            "diagram": st.session_state.selected_diagram,
                            "instruction": instruction,
                        })
                    if result:
                        st.session_state.selected_diagram = result["diagram"]
                        st.session_state.edit_history.append(
                            json.loads(json.dumps(result["diagram"]))
                        )
                        st.session_state.mermaid_code = ""
                        st.session_state.drawio_xml = ""
                        st.success("✅ Diagram updated!")
                        st.rerun()
        with col2:
            if len(st.session_state.edit_history) > 1:
                if st.button("↩️ Undo", use_container_width=True):
                    st.session_state.edit_history.pop()
                    st.session_state.selected_diagram = json.loads(
                        json.dumps(st.session_state.edit_history[-1])
                    )
                    st.session_state.mermaid_code = ""
                    st.session_state.drawio_xml = ""
                    st.rerun()

        # Show current state
        st.divider()
        st.markdown("### Current diagram")
        n_nodes, n_edges, types = diagram_stats(st.session_state.selected_diagram)
        m1, m2, m3 = st.columns(3)
        m1.metric("Nodes", n_nodes)
        m2.metric("Edges", n_edges)
        m3.metric("Edit steps", len(st.session_state.edit_history) - 1)

        with st.spinner("Rendering preview…"):
            m = api("/export/mermaid", st.session_state.selected_diagram)
        if m:
            st.session_state.mermaid_code = m["mermaid"]
            mermaid_preview(m["mermaid"])

        with st.expander("Edit history"):
            for i, hist in enumerate(st.session_state.edit_history):
                n, e, _ = diagram_stats(hist)
                label = "Original" if i == 0 else f"Edit {i}"
                st.markdown(f"**{label}** — {n} nodes, {e} edges")


# ══════════════════════════════════════════════════════════════════════════════
# TAB 3 — EXPORT
# ══════════════════════════════════════════════════════════════════════════════
with tab_export:
    if st.session_state.selected_diagram is None:
        st.info("👈 Generate and select a variant first.")
    else:
        st.markdown("### 📤 Export your diagram")
        diagram = st.session_state.selected_diagram

        col_m, col_d = st.columns(2)

        # ── Mermaid ──────────────────────────────────────────────────────────
        with col_m:
            st.markdown("#### 🧜 Mermaid")
            st.caption("Paste into GitHub, GitLab, Notion, or any Mermaid-compatible tool.")
            if st.button("Generate Mermaid", use_container_width=True):
                with st.spinner():
                    m = api("/export/mermaid", diagram)
                if m:
                    st.session_state.mermaid_code = m["mermaid"]

            if st.session_state.mermaid_code:
                st.code(st.session_state.mermaid_code, language="text")
                st.download_button(
                    "⬇️ Download .mmd",
                    data=st.session_state.mermaid_code,
                    file_name="diagram.mmd",
                    mime="text/plain",
                    use_container_width=True,
                )

        # ── draw.io ──────────────────────────────────────────────────────────
        with col_d:
            st.markdown("#### 🖊️ draw.io / diagrams.net")
            st.caption("Open in draw.io for full visual editing.")
            if st.button("Generate draw.io XML", use_container_width=True):
                with st.spinner():
                    d = api("/export/drawio", diagram)
                if d:
                    st.session_state.drawio_xml = d["xml"]

            if st.session_state.drawio_xml:
                st.code(st.session_state.drawio_xml[:800] + "…", language="xml")
                st.download_button(
                    "⬇️ Download .drawio",
                    data=st.session_state.drawio_xml,
                    file_name="diagram.drawio",
                    mime="application/xml",
                    use_container_width=True,
                )

        st.divider()
        st.markdown("#### 📋 Raw JSON IR")
        st.caption("The canonical source of truth — import into any future tool.")
        st.download_button(
            "⬇️ Download diagram.json",
            data=json.dumps(diagram, indent=2),
            file_name="diagram.json",
            mime="application/json",
            use_container_width=True,
        )
        st.json(diagram)
