"use client";
import { useEffect, useState, useCallback, useRef, type MouseEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  useNodesState, useEdgesState, ReactFlowProvider, useReactFlow,
  type Connection, type Node, type Edge,
import "@xyflow/react/dist/style.css";
import {
  Undo2, Redo2, Wand2, Share2, Plus, Loader2, X, ChevronRight, ChevronLeft,
} from "lucide-react";
import { nodeTypes } from "@/components/dashboard/nodes/CustomNodes";
  umlEdgeTypes, type UMLRelType, REL_TYPE_OPTIONS, RelTypeIcon,
import { SequenceCanvas } from "@/components/dashboard/sequence/SequenceCanvas";
import { ERDInspector } from "@/components/dashboard/ERDInspector";
import { RelationshipInspector } from "@/components/dashboard/RelationshipInspector";
import { getCanvasLibrary, type ShapeItem, type EdgeTypeItem } from "@/lib/canvasLibrary";
import { api, type Diagram } from "@/lib/api";
import { validateDiagramByType } from "@/lib/diagramModules";
import { useAutosaveDiagram } from "@/hooks/useAutosaveDiagram";
  useVariantManager, type StoredVariant,
import { sessionRepository } from "@/lib/db/sessionRepository";
import { useSaveDiagram } from "@/hooks/useSaveDiagram";
interface StoredDiagram {
  diagramType: string;
  categoryId: string;
  activeVariantId?: string;

  targetVariant: StoredVariant | null;
  onSaveCopy: () => void;
}
  if (!targetVariant) return null;
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        initial={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[340px] p-6"
        <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
          <div>
            <p className="text-[11px] text-gray-400 mt-0.5">
            </p>
        </div>
        <p className="text-[12px] text-gray-600 mb-5 leading-relaxed">
          current changes unless you save them as a working copy first.

          <button
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[12px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            <Copy size={13} />
          </button>
            onClick={onReplace}
          >
            Discard changes &amp; switch
          <button
            className="w-full px-4 py-2 text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
            Cancel
        </div>
    </div>
}
interface VariantPanelProps {
  activeVariantId: string | null;
  onSwitch: (v: StoredVariant) => void;
}
  if (variants.length === 0) return null;
    <div className="flex flex-col gap-1.5">
        const isActive = v.id === activeVariantId;
        return (
            key={v.id}
            title={isActive && isDirty ? "Unsaved changes" : v.label}
              isActive
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
          >
            <div className="w-full h-[72px] bg-gray-50 flex items-center justify-center overflow-hidden">
                <div
                  dangerouslySetInnerHTML={{ __html: svg }}
              ) : (
              )}

            <div className="px-2.5 py-1.5 flex items-center justify-between gap-1.5">
                {v.label}
              <div className="flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
                {isActive && (
                )}
            </div>
        );
    </div>
}
function FlowEdgeTypeIcon({ edgeType, active }: { edgeType: EdgeTypeItem; active: boolean }) {
  const h  = 14;
  const isDashed   = edgeType.edgeStyle === "dashed";
  const openArrow  = edgeType.arrowType === "open";
  const isTwoWay   = edgeType.direction === "two_way";

    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
        stroke={c} strokeWidth="1.5" strokeDasharray={isDashed ? "4,3" : undefined} />
        ? <polygon points={`${arrowEndX},2 ${w-1},7 ${arrowEndX},12`} fill="#ffffff" stroke={c} strokeWidth="1.4" />
        ? <path d={`M${arrowEndX},3 L${w-1},7 L${arrowEndX},11`} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
        ? <polygon points="10,2 1,7 10,12" fill="#ffffff" stroke={c} strokeWidth="1.4" />
        ? <path d="M10,3 L1,7 L10,11" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
  );

  diagramType,
  onRelTypeSelect,
  onFlowEdgeTypeSelect,
  activeVariantId,
  onSwitchVariant,
}: {
  pendingRelType?: UMLRelType | null;
  pendingFlowEdgeType?: string | null;
  variants: StoredVariant[];
  isDirty: boolean;
  previews: Record<string, string>;
  const lib = getCanvasLibrary(diagramType);
  const hasVariants = variants.length > 1;
  const onDragStart = (e: React.DragEvent, shape: ShapeItem) => {
    e.dataTransfer.setData("application/reactflow/irType", shape.irType);
    e.dataTransfer.setData("application/reactflow/width", String(shape.width ?? 140));
    e.dataTransfer.effectAllowed = "move";

    <aside className="w-[200px] shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      {hasVariants && (
          <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center gap-1.5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Variants</p>
          <div className="p-2.5 border-b border-gray-100">
              variants={variants}
              isDirty={isDirty}
              previews={previews}
          </div>
      )}
      {}
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Shapes</p>
      <div className="flex flex-col gap-1.5 p-3">
          <div
            draggable
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 cursor-grab active:cursor-grabbing transition-all text-[12px] text-gray-700 font-medium select-none"
          >
            <span>{shape.label}</span>
        ))}

      {isClass && onRelTypeSelect && (
          <div className="px-4 py-2.5 border-t border-b border-gray-100 bg-gray-50">
            <p className="text-[9px] text-gray-400 mt-0.5">Select a type, then drag between handles</p>
          <div className="flex flex-col gap-1 p-2.5">
              const active = pendingRelType === opt.value;
                <button
                  onClick={() => onRelTypeSelect(active ? null : opt.value)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all select-none text-left w-full ${
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                  }`}
                  <RelTypeIcon relType={opt.value} active={active} size={28} />
                </button>
            })}
          {pendingRelType && (
              <p className="text-[10px] font-semibold text-blue-600 leading-tight">
              </p>
            </div>
        </>

      {!isClass && lib.edgeTypes && lib.edgeTypes.length > 0 && onFlowEdgeTypeSelect && (
          <div className="px-4 py-2.5 border-t border-b border-gray-100 bg-gray-50">
            <p className="text-[9px] text-gray-400 mt-0.5">Select type, then drag between nodes</p>
          <div className="flex flex-col gap-1 p-2.5">
              const active = pendingFlowEdgeType === et.id;
                <button
                  onClick={() => onFlowEdgeTypeSelect(active ? null : et.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all select-none text-left w-full ${
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                  }`}
                  <FlowEdgeTypeIcon edgeType={et} active={active} />
                </button>
            })}
          {pendingFlowEdgeType && (
              <p className="text-[10px] font-semibold text-blue-600 leading-tight">
              </p>
            </div>
        </>

        <p className="text-[10px] text-gray-400 leading-relaxed">
            ? "Drag shapes to canvas · Select a connection type above"
            ? "Drag shapes · Select a connection type above"
        </p>
    </aside>
}
function ShapePreview({ shape }: { shape: ShapeItem }) {
    entity:      "bg-slate-700",
    associative: "bg-teal-600",

    processNode:    "bg-gray-300",
    endNode:        "bg-emerald-200",
    storageNode:    "bg-orange-200",
    queueNode:      "bg-slate-200",
    weakEntityNode: "bg-gray-100 border border-gray-600",
    pkAttrNode:     "bg-indigo-200 rounded-full",
    interfaceNode:  "bg-indigo-100",
    enumNode:       "bg-amber-100",
    decisionNode:   "bg-amber-100 rotate-45",

    return (
    );

    <div className={`w-5 h-5 shrink-0 rounded-sm ${colors[shape.nodeType] ?? "bg-gray-200"}`} />
}
interface AIEditPanelProps {
  onClose: () => void;
  loading: boolean;
  historyLength: number;
}
function AIEditPanel({ open, onClose, onApply, loading, error, historyLength, onUndo }: AIEditPanelProps) {

    if (!instruction.trim()) return;
    setInstruction("");

    <AnimatePresence>
        <motion.aside
          animate={{ width: 280, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-semibold text-gray-700">AI Edit</p>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            </button>

            <p className="text-[11px] text-gray-400 leading-relaxed">
            </p>
            {error && (
                <p className="text-[11px] text-red-600">{error}</p>
            )}
            <textarea
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={'e.g. "Add a retry loop after the error state"'}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue/50 transition-all"

              onClick={handleApply}
              className="flex items-center justify-center gap-2 bg-apple-blue hover:bg-blue-600 disabled:opacity-40 text-white text-[12px] font-semibold py-2.5 rounded-xl transition-colors"
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
            </button>
            <button
              disabled={historyLength <= 1}
            >
              Undo last edit
          </div>
          <div className="px-4 pb-4">
              {historyLength - 1} edit{historyLength !== 2 ? "s" : ""} applied · ⌘↵ to apply
          </div>
      )}
  );

  icon: Icon, title, onClick, className = "", disabled = false,
  icon: React.ElementType; title: string; onClick: () => void;
}) {
    <button
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-30 transition-colors ${className}`}
      <Icon size={15} />
  );

  open, onMermaid, onDrawio, onJson,
  open: boolean; onMermaid: () => void; onDrawio: () => void; onJson: () => void;
  return (
      {open && (
          initial={{ opacity: 0, y: -6 }}
          exit={{ opacity: 0, y: -6 }}
        >
            { label: "Mermaid (.mmd)", action: onMermaid },
            { label: "JSON IR (.json)", action: onJson },
            <button
              onClick={item.action}
            >
              {item.label}
          ))}
      )}
  );

  initialNodes: Node[];
  diagramType: string;
  categoryId: string;
  diagramMetaId: string;
  allVariants: StoredVariant[];

  initialNodes, initialEdges, diagramType, diagramLabel, categoryId, diagramId,
}: CanvasInnerProps) {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [editError, setEditError] = useState<string | null>(null);
  type HistoryEntry = { nodes: Node[]; edges: Edge[] };
  const redoStack = useRef<HistoryEntry[]>([]);
  const [redoCount, setRedoCount] = useState(0);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pendingRelType, setPendingRelType] = useState<UMLRelType | null>(null);
  const [erdTab, setErdTab] = useState<"properties" | "ai">("properties");
  const [classTab, setClassTab] = useState<"properties" | "ai">("properties");


    diagramRepository.get(diagramMetaId).then((meta) => {
    }).catch(() => {});

    diagramMetaId,
    categoryId,
    firestoreId,
  });
  const [switchTarget, setSwitchTarget] = useState<StoredVariant | null>(null);

    diagramMetaId,
    initialActiveVariantId,
  );
  const isErd   = diagramType === "erd";
  const isSystemArch = diagramType === "system_arch";
  const canvasRef = useRef<HTMLDivElement>(null);

    ? "Saving…"
    ? "No Access"
    ? "Sign In"
    ? "Setup"
    ? "Relink"
    ? "Invalid Data"
    ? "Retry"
    ? "Saved"

    ? "Sign in to save to cloud"
    ? "Firestore rules denied this write. Deploy updated firestore.rules and ensure you are signed in."
    ? "Firestore is not fully configured for this project. Ensure Firestore database is created and required indexes are deployed."
    ? "Saved cloud document was missing. Click again to create a new cloud copy."
    ? "Document payload has invalid values for Firestore (for example undefined fields)."
    ? "Network error while saving. Check internet and retry."
    ? `Save failed: ${cloudErrorDetail}`
    ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}`


    variantId: variantMgr.activeVariantId,
    onSaved: () => setDirty(false),

    onNodesChange(changes);
    const structural = (changes as Array<{ type: string }>).some(
    );
      setDirty(true);
    }

    onEdgesChange(changes);
    if (structural) {
      markDirty(getNodes(), getEdges());
  }, [onEdgesChange, setDirty, markDirty, getNodes, getEdges]);
  useEffect(() => {
      Promise.all(
          const p = await previewRepository.get(v.id);
        })
        setPreviews(Object.fromEntries(entries.filter(([, svg]) => svg)));
    });

    if (target.id === variantMgr.activeVariantId) return;
      setSwitchTarget(target);
      doSwitch(target);
  }, [variantMgr.activeVariantId, variantMgr.isDirty]);
  const doSwitch = useCallback(async (target: StoredVariant) => {
    await variantMgr.switchVariant(target.id, flowToIr(getNodes(), getEdges(), diagramType));
    setNodes(newNodes);
    undoStack.current = [];
    setUndoCount(0);
    setSelectedNodeId(null);
    fitView();

    if (!switchTarget) return;
  }, [switchTarget, doSwitch]);
  const handleModalSaveCopy = useCallback(async () => {
    const currentIr = flowToIr(getNodes(), getEdges(), diagramType);

    await doSwitch(switchTarget);

  const pushHistory = useCallback(() => {
    const es = getEdges();
      ...undoStack.current.slice(-(MAX_HISTORY - 1)),
    ];
    setUndoCount(undoStack.current.length);
  }, [getNodes, getEdges]);
  const applySystemArchRelayout = useCallback((ir: GraphDiagram, nextSelectedNodeId?: string | null) => {
    const { nodes: newNodes, edges: newEdges } = irToFlow(ir, diagramType);
    setEdges(newEdges);
    markDirty(newNodes, newEdges);
    setSelectedEdgeId(null);

    (connection: Connection) => {
      if (isSystemArch && connection.source && connection.target) {
        nextIr.edges.push({ source: connection.source, target: connection.target, label: "" });
        return;

        const relType = pendingRelType ?? "association";
        const newEdge: Edge = {
          id: newId,
          data: {
            sourceMultiplicity: "",
            label: "",
        };
        setSelectedEdgeId(newId);
        setClassTab("properties");
        const newId = `edge_${Date.now()}`;
        const edgeTypeDef = pendingFlowEdgeType
          : undefined;
          label: "",
        };
          edgeData.relationshipType = edgeTypeDef.id;
          if (edgeTypeDef.arrowType)  edgeData.arrowType  = edgeTypeDef.arrowType;
          if (diagramType === "use_case") {
            else if (edgeTypeDef.id === "extend") edgeData.label = "<<extend>>";
            else if (edgeTypeDef.id === "association") edgeData.label = "";
        } else if (diagramType === "use_case") {
          edgeData.edgeStyle = "solid";
          edgeData.direction = "one_way";
        setEdges((eds) =>
            {
              id: newId,
              data: edgeData,
            },
          )
        setSelectedEdgeId(newId);
      }
    [applySystemArchRelayout, diagramType, getEdges, getNodes, isClass, isSystemArch, lib.edgeTypes, pendingFlowEdgeType, pendingRelType, pushHistory, setEdges]

    pushHistory();
      const nextNodes = getNodes().filter((n) => !n.selected);
      applySystemArchRelayout(flowToIr(nextNodes, nextEdges, diagramType), null);
    }
    setNodes((ns) => ns.filter((n) => !n.selected));
  }, [applySystemArchRelayout, diagramType, getEdges, getNodes, isSystemArch, pushHistory, setEdges, setNodes]);
  const addBlankNode = useCallback(() => {
    const id = `node_${Date.now()}`;
    const nType = defaultShape?.nodeType ?? "processNode";
    const label = defaultShape?.defaultLabel ?? "New Node";
    const isTable = nType === "tableNode";
    if (isSystemArch) {
      nextIr.nodes.push({ id, label, type: irType });
      return;

      id,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
        ? { label, nodeType: irType, classKind: irType, attributes: [], methods: [], diagramType }
        ? { label, nodeType: irType, fields: [], tableStyle: "regular", diagramType }
    };
    if (isTable) setSelectedNodeId(id);
  }, [applySystemArchRelayout, diagramType, getEdges, getNodes, isSystemArch, lib.shapes, pushHistory, setNodes]);
  const onNodeDragStart = useCallback((_: MouseEvent, _node: Node) => {
  }, [pushHistory]);
  const onNodeClick = useCallback((_: MouseEvent, node: Node) => {
    setSelectedEdgeId(null);

    setSelectedEdgeId(edge.id);
  }, []);
  const onPaneClick = useCallback(() => {
    setSelectedEdgeId(null);

    setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));

    e.preventDefault();
  }, []);
  const onDrop = useCallback(
      e.preventDefault();
      const irType = e.dataTransfer.getData("application/reactflow/irType");
      if (!nodeType) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const isClassNode = ["classNode", "interfaceNode", "abstractNode", "enumNode"].includes(nodeType);

        const nextIr = flowToIr(getNodes(), getEdges(), diagramType);
        applySystemArchRelayout(nextIr, id);
      }
      pushHistory();
        id,
        position,
          ? {
              nodeType: irType,
              tableStyle:
                irType === "associative" ? "associative" :
              diagramType,
          : isClassNode
          : { label, nodeType: irType, diagramType },
      setNodes((ns) => [...ns, newNode]);
    },
  );
  const applyAIEdit = async (instruction: string) => {
    setEditError(null);
      const currentIr = flowToIr(getNodes(), getEdges(), diagramType);
      const validation = validateDiagramByType(diagramType, updated as DiagramDocument);
        throw new Error(`AI edit produced invalid ${diagramType} output: ${validation.errors[0] ?? "module validation failed"}`);
      pushHistory();
      setNodes(newNodes);
      variantMgr.setDirty(true);
    } catch (err) {
    } finally {
    }

    if (!undoStack.current.length) return;
    const curr = { nodes: getNodes(), edges: getEdges() };
    redoStack.current = [...redoStack.current.slice(-(MAX_HISTORY - 1)), curr];
    setEdges(prev.edges);
    setRedoCount(redoStack.current.length);
    markDirty(prev.nodes, prev.edges);

    if (!redoStack.current.length) return;
    const curr = { nodes: getNodes(), edges: getEdges() };
    undoStack.current = [...undoStack.current.slice(-(MAX_HISTORY - 1)), curr];
    setEdges(next.edges);
    setRedoCount(redoStack.current.length);
    markDirty(next.nodes, next.edges);

    const handleKeyDown = (e: KeyboardEvent) => {
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (tag === "input" || tag === "textarea") return;
        e.preventDefault();
      } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
        redo();
    };
    return () => window.removeEventListener("keydown", handleKeyDown);

    try {
      const { mermaid } = await api.exportMermaid(ir);
      const url = URL.createObjectURL(blob);
      URL.revokeObjectURL(url);
    setShowExport(false);

    try {
      const { xml } = await api.exportDrawio(ir);
      const url = URL.createObjectURL(blob);
      URL.revokeObjectURL(url);
    setShowExport(false);

    const ir = flowToIr(getNodes(), getEdges(), diagramType);
    const url = URL.createObjectURL(blob);
    URL.revokeObjectURL(url);
  };
  return (
      {}
        {switchTarget && (
            targetVariant={switchTarget}
            onSaveCopy={handleModalSaveCopy}
          />
      </AnimatePresence>
      {}
        <Link
          className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-800 transition-colors mr-2"
          <ArrowLeft size={13} />
        </Link>
        <div className="w-px h-5 bg-gray-200" />
        <span className="text-[13px] font-semibold text-gray-700">{diagramLabel}</span>

        {variantMgr.isDirty && (
        )}
        <div className="flex-1" />
        {}
          <ToolBtn icon={Plus}      title="Add node"         onClick={addBlankNode} />
          <div className="w-px h-5 bg-gray-200 mx-0.5" />
          <ToolBtn icon={ZoomOut}   title="Zoom out"         onClick={() => zoomOut()} />
          <div className="w-px h-5 bg-gray-200 mx-0.5" />
          <ToolBtn icon={Redo2}     title="Redo (⌘Y)"        onClick={redo} disabled={redoCount === 0} />

          <button
            className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                ? "bg-apple-blue text-white"
            }`}
            <Wand2 size={13} />
            {showAIPanel ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        )}
        {}
          onClick={async () => {
              await saveToCloud(getNodes(), getEdges());

          }}
          title={cloudButtonTitle}
            cloudError
              : lastSaved
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
            <Loader2 size={13} className="animate-spin" />
            <CloudOff size={13} />
            <Cloud size={13} />
          {cloudButtonLabel}

          <button
            className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            <Download size={13} />
          </button>
            open={showExport}
            onDrawio={exportDrawio}
          />
      </div>
      {}
        <ShapePanel
          pendingRelType={isClass ? pendingRelType : null}
          pendingFlowEdgeType={!isClass && !isSystemArch ? pendingFlowEdgeType : null}
          variants={variantMgr.variants}
          isDirty={variantMgr.isDirty}
          previews={previews}

        <div
          className={`flex-1 relative min-h-0 ${diagramType === "use_case" ? "usecase-canvas" : ""}`}
          onDragOver={onDragOver}
          <div className="absolute inset-0">
            nodes={nodes}
            onNodesChange={handleNodesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            connectionMode={isClass ? ConnectionMode.Loose : ConnectionMode.Strict}
            deleteKeyCode="Delete"
            edgesReconnectable
            style={{ background: "#f8fafc" }}
            <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#e2e8f0" />
              style={{
                border: "1px solid #e5e7eb",
                overflow: "hidden",
            />
              style={{
                border: "1px solid #e5e7eb",
              }}
              maskColor="rgba(248,250,252,0.75)"
            <Panel position="bottom-center">
                {isErd
                  : isClass
                  : isSystemArch
                  : "Drag shapes from the left panel · Connect handles · Double-click to rename · Del to delete"}
            </Panel>
          </div>

        {isErd ? (
            <div className="flex border-b border-gray-200 shrink-0">
                onClick={() => setErdTab("properties")}
                  erdTab === "properties" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-600"
              >
              </button>
                onClick={() => setErdTab("ai")}
                  erdTab === "ai" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-600"
              >
              </button>
            {erdTab === "properties" ? (
            ) : (
                <p className="text-[11px] text-gray-400 leading-relaxed">
                </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  </div>
                <textarea
                  onChange={(e) => setErdAIInstruction(e.target.value)}
                    if (e.key === "Enter" && e.metaKey && erdAIInstruction.trim()) {
                    }
                  placeholder={'e.g. "Add an Orders table with FK to Users"'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue/50 transition-all"
                <button
                  disabled={editLoading || !erdAIInstruction.trim()}
                >
                  {editLoading ? "Applying…" : "Apply (⌘↵)"}
                <button onClick={undo} disabled={undoCount === 0}
                >
                </button>
                  <p className="text-[10px] text-gray-400">{undoCount} edit{undoCount !== 1 ? "s" : ""} applied · ⌘↵ to apply</p>
              </div>
          </div>
          <div className="w-[280px] shrink-0 bg-white border-l border-gray-200 flex flex-col">
              <button
                className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors ${
                }`}
                {selectedEdgeId ? "Relationship" : "Properties"}
              <button
                className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                }`}
                <Wand2 size={11} /> AI Edit
            </div>
              selectedEdgeId ? (
              ) : (
              )
              <div className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto">
                  Describe a class diagram change in plain English.
                {editError && (
                    <p className="text-[11px] text-red-600">{editError}</p>
                )}
                  value={classAIInstruction}
                  onKeyDown={(e) => {
                      applyAIEdit(classAIInstruction.trim()).then(() => setClassAIInstruction(""));
                  }}
                  rows={4}
                />
                  onClick={async () => { if (!classAIInstruction.trim()) return; await applyAIEdit(classAIInstruction.trim()); setClassAIInstruction(""); }}
                  className="flex items-center justify-center gap-2 bg-apple-blue hover:bg-blue-600 disabled:opacity-40 text-white text-[12px] font-semibold py-2.5 rounded-xl transition-colors"
                  {editLoading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
                </button>
                  className="flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30 text-[12px] py-2 rounded-xl transition-colors"
                  <Undo2 size={13} /> Undo last edit
                <div className="mt-auto pt-2">
                </div>
            )}
        ) : selectedEdgeId ? (
          (() => {
            const selData = (sel?.data ?? {}) as {
              relationshipType?: string;
              arrowType?: "filled" | "open" | "none" | "triangle";
              routingMode?: "smooth" | "straight";
            const curLabel     = selData.label ?? "";
            const curArrow     = selData.arrowType ?? "filled";
            const curRouting   = selData.routingMode ?? "smooth";

              setEdges((eds) => eds.map((ed) =>
                  ? { ...ed, data: { ...(ed.data ?? {}), ...patch } }
              ));

              <div className="w-[280px] shrink-0 bg-white border-l border-gray-200 flex flex-col">
                  <p className="text-[11px] font-semibold text-gray-700">Connection</p>
                    onClick={() => setSelectedEdgeId(null)}
                  >
                  </button>
                <div className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto">
                  {}
                    <div>
                        Type
                      <select
                        onChange={(e) => {
                          const patch: Record<string, unknown> = { relationshipType: e.target.value };
                          if (chosen?.arrowType)  patch.arrowType  = chosen.arrowType;
                          if (diagramType === "use_case") {
                            const existing = curLabel.trim().toLowerCase();
                            if (replaceable) {
                              else if (e.target.value === "extend") patch.label = "<<extend>>";
                            }
                          updateEdgeData(patch);
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue/50 transition-all"
                        <option value="">— no type —</option>
                          <option key={et.id} value={et.id}>{et.label}</option>
                      </select>
                  )}
                  {}
                    <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    </label>
                      key={selectedEdgeId}
                      placeholder="e.g. yes / no / success"
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                    />
                  </div>
                  {}
                    <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    </label>
                      {(["solid", "dashed"] as const).map((s) => (
                          key={s}
                          className={`flex-1 py-1.5 text-[11px] rounded-lg border transition-colors ${
                              ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                          }`}
                          {s === "solid" ? "Solid" : "Dashed"}
                      ))}
                  </div>
                  {}
                    <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    </label>
                      {(["filled", "open", "triangle", "none"] as const).map((a) => (
                          key={a}
                          className={`flex-1 py-1.5 text-[11px] rounded-lg border transition-colors ${
                              ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                          }`}
                          {a === "filled" ? "Filled" : a === "open" ? "Open" : a === "triangle" ? "Triangle" : "None"}
                      ))}
                  </div>
                  {}
                    <div>
                        Direction
                      <div className="flex gap-1.5">
                          onClick={() => updateEdgeData({ direction: "one_way" })}
                            curDirection === "one_way"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                        >
                        </button>
                          onClick={() => updateEdgeData({ direction: "two_way" })}
                            curDirection === "two_way"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                        >
                        </button>
                    </div>

                  <div>
                      Routing
                    <div className="flex gap-1.5">
                        onClick={() => updateEdgeData({ routingMode: "smooth" })}
                          curRouting === "smooth"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                      >
                      </button>
                        onClick={() => updateEdgeData({ routingMode: "straight" })}
                          curRouting === "straight"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                      >
                      </button>
                  </div>
                  <button
                      setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
                    }}
                  >
                    Delete connection
                </div>
            );
        ) : selectedNodeId ? (
          (() => {
            if (!selNode) return null;
            return (
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    <X size={13} />
                </div>
                  {}
                    <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    </label>
                      key={selectedNodeId}
                      placeholder="Node label"
                        const val = e.target.value.trim();
                        setNodes((ns) => ns.map((n) =>
                        ));
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                    />
                  </div>
                  {}
                    <div>
                        Type
                      <select
                        onChange={(e) => {
                          if (!shape) return;
                            n.id === selectedNodeId
                              : n
                        }}
                      >
                          <option key={s.id} value={s.irType}>{s.label}</option>
                      </select>
                  )}
                  <button
                      setNodes((ns) => ns.filter((n) => n.id !== selectedNodeId));
                      setSelectedNodeId(null);
                    className="mt-auto flex items-center gap-2 text-[12px] font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-xl px-3 py-2 transition-colors"
                    <Trash2 size={12} />
                  </button>
              </div>
          })()
          <AIEditPanel
            onClose={() => setShowAIPanel(false)}
            loading={editLoading}
            historyLength={undoCount + 1}
          />
      </div>
  );

  const params = useParams() as { category: string; diagram: string };


  const [ready, setReady] = useState(false);
  useEffect(() => {


      return;

      const raw = sessionStorage.getItem("afd_diagram");
        setSessionStored(JSON.parse(raw));
        router.replace(`/dashboard/${params.category}/${params.diagram}`);
    } catch {
    }
  }, [restoreStatus, params.category, params.diagram, router]);
  useEffect(() => {
    sessionRepository.save({
      activeVariantId: sessionStored.activeVariantId,
      diagramLabel:    sessionStored.diagramLabel,
      diagramId:       params.diagram,
  }, [sessionStored, params.category, params.diagram]);
  if (!ready || (restoreStatus !== "restored" && !sessionStored)) {
      <div className="flex-1 flex items-center justify-center bg-apple-bg">
      </div>
  }
  let initialNodes: ReturnType<typeof irToFlow>["nodes"] = [];
  let initialDocument: DiagramDocument;
  let diagramLabel: string;
  let activeVariantId: string;

    initialDocument = restored.document;
    initialEdges    = restored.edges ?? [];
    diagramLabel    = restored.diagramLabel;
    activeVariantId = restored.activeVariantId;
  } else {
    initialDocument = s.ir;
      ({ nodes: initialNodes, edges: initialEdges } = irToFlow(s.ir as GraphDiagram, s.diagramType));
    diagramType     = s.diagramType;
    diagramMetaId   = s.diagramMetaId ?? "";
    allVariants     = [];


    return (
        initialDocument={initialDocument}
        categoryId={params.category}
        diagramMetaId={diagramMetaId}
        allVariants={allVariants}
    );

    return (
        initialDocument={initialDocument}
        categoryId={params.category}
        diagramMetaId={diagramMetaId}
        allVariants={allVariants}
    );

    <div className="flex flex-col h-[calc(100vh-52px)]">
        <CanvasInner
          initialEdges={initialEdges}
          diagramLabel={diagramMeta?.label ?? diagramLabel}
          diagramId={params.diagram}
          activeVariantId={activeVariantId}
        />
    </div>
}
