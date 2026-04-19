"use client";
import { useCallback, useRef, useState } from "react";
  ReactFlow, Background, Controls, MiniMap, addEdge,
  type Connection, type Node, type Edge,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
  Download, Trash2, ZoomIn, ZoomOut, Maximize2,
} from "lucide-react";
import { flowToIr, irToFlow } from "@/lib/flowUtils";
import type { GraphDiagram } from "@/lib/diagramTypes";
interface Props {
  initialEdges: Edge[];
}
function CanvasInner({ initialNodes, initialEdges, onDiagramChange }: Props) {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [editLoading, setEditLoading] = useState(false);
    { nodes: initialNodes, edges: initialEdges },
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const onConnect = useCallback(
    [setEdges]

    setNodes((ns) => ns.filter((n) => !n.selected));
  }, [setNodes, setEdges]);
  const addNode = useCallback(() => {
    const newNode: Node = {
      type: "processNode",
      data: { label: "New Node", nodeType: "process" },
    setNodes((ns) => [...ns, newNode]);

    if (!editInstruction.trim()) return;
    setError(null);
      const currentIr = flowToIr(getNodes(), getEdges());
      const { nodes: newNodes, edges: newEdges } = irToFlow(updated as GraphDiagram);
      setEdges(newEdges);
      setEditInstruction("");
    } catch (e) {
    } finally {
    }

    if (editHistory.length <= 1) return;
    setEditHistory((h) => h.slice(0, -1));
    setEdges(prev.edges);


    if (!el) return;
    const dataUrl = await imgToPng(el, { backgroundColor: "#0f172a" });
    a.href = dataUrl;
    a.click();

    const ir = flowToIr(getNodes(), getEdges());
      const { mermaid } = await api.exportMermaid(ir);
      const url = URL.createObjectURL(blob);
      a.href = url; a.download = "diagram.mmd"; a.click();
    } catch {}

    const ir = flowToIr(getNodes(), getEdges());
      const { xml } = await api.exportDrawio(ir);
      const url = URL.createObjectURL(blob);
      a.href = url; a.download = "diagram.drawio"; a.click();
    } catch {}

    const ir = flowToIr(getNodes(), getEdges());
    const url = URL.createObjectURL(blob);
    a.href = url; a.download = "diagram.json"; a.click();
  };
  return (
      <ReactFlow
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        deleteKeyCode="Delete"
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
          style={{ background: "#1e293b", border: "1px solid #334155" }}
          maskColor="rgba(15,23,42,0.7)"

        <Panel position="top-left">
            <ToolBtn icon={Plus}     title="Add node"     onClick={addNode} />
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <ToolBtn icon={ZoomOut}  title="Zoom out"     onClick={() => zoomOut()} />
            <div className="w-px h-5 bg-slate-700 mx-1" />
          </div>

        <Panel position="top-right">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium px-3 py-2 rounded-xl transition-colors shadow-lg"
              <Code2 size={14} /> AI Edit
            <button
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-[12px] font-medium px-3 py-2 rounded-xl transition-colors shadow-lg"
              <Download size={14} /> Export
          </div>

        <Panel position="bottom-center">
            Drag nodes · Connect handles · Double-click to edit text · Del to delete
        </Panel>

      <AnimatePresence>
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-14 right-3 w-72 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-2xl p-4 shadow-2xl z-10"
            <p className="text-[13px] font-semibold text-white mb-3">AI Edit</p>
            <textarea
              onChange={(e) => setEditInstruction(e.target.value)}
              rows={3}
            />
              <button
                disabled={editLoading || !editInstruction.trim()}
              >
                {editLoading ? "Applying…" : "Apply"}
              <button onClick={undo} disabled={editHistory.length <= 1}
              >
              </button>
          </motion.div>
      </AnimatePresence>
      {}
        {showExport && (
            initial={{ opacity: 0, x: 16 }}
            exit={{ opacity: 0, x: 16 }}
          >
            <div className="flex flex-col gap-2">
                { label: "Mermaid (.mmd)", action: exportMermaid },
                { label: "JSON IR (.json)", action: exportJson },
                <button
                  onClick={item.action}
                >
                  {item.label}
              ))}
          </motion.div>
      </AnimatePresence>
  );

  icon: Icon, title, onClick, className = "", disabled = false,
  icon: React.ElementType; title: string; onClick: () => void;
}) {
    <button
      onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 transition-colors ${className}`}
      <Icon size={15} />
  );

  return (
      <CanvasInner {...props} />
  );
