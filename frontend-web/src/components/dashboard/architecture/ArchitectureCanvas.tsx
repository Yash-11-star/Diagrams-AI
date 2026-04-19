"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlowProvider,
  useNodesState,
  type Connection,
  type EdgeChange,
  type NodeChange,
import { AnimatePresence, motion } from "framer-motion";
  AlertTriangle,
  Cloud,
  Copy,
  Layers,
  Maximize2,
  Trash2,
  Wand2,
  ZoomOut,
import { ArchitecturePalette } from "./ArchitecturePalette";
import { nodeTypes } from "@/components/dashboard/nodes/CustomNodes";
import { ApiError, api } from "@/lib/api";
import {
  addArchitectureLayer,
  deleteArchitectureEdge,
  moveArchitectureLayer,
  reconnectArchitectureEdge,
  updateArchitectureEdge,
  updateArchitectureNode,
import { buildArchitectureFlow, architectureNodeSize, type ArchitectureFlowLayout } from "@/lib/architectureLayout";
import type {
  ArchitectureNode,
  DiagramDocument,
} from "@/lib/diagramTypes";
import { useAutosaveDiagram } from "@/hooks/useAutosaveDiagram";
import { previewRepository } from "@/lib/db/previewRepository";
import { useSaveDiagram } from "@/hooks/useSaveDiagram";
interface SwitchModalProps {
  onReplace: () => void;
  onCancel: () => void;

  if (!targetVariant) return null;
  return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
      >
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          </div>
            <p className="text-[14px] font-semibold text-gray-800">Unsaved changes</p>
          </div>

          <button
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[12px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            <Copy size={13} />
          </button>
            onClick={onReplace}
          >
            Discard changes and switch
          <button onClick={onCancel} className="w-full px-4 py-2 text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
          </button>
      </motion.div>
  );

  open,
  onDrawio,
}: {
  onMermaid: () => void;
  onJson: () => void;
  return (
      {open && (
          initial={{ opacity: 0, y: -6 }}
          exit={{ opacity: 0, y: -6 }}
        >
            { label: "Mermaid (.mmd)", action: onMermaid },
            { label: "JSON (.json)", action: onJson },
            <button
              onClick={item.action}
            >
              {item.label}
          ))}
      )}
  );

  if (!selection) return diagram.layers[0]?.id ?? null;
  if (selection.type === "node") return diagram.nodes.find((node) => node.id === selection.id)?.layerId ?? diagram.layers[0]?.id ?? null;
}
function orderedNodeIdsForLayer(diagram: ArchitectureDiagram, layerId: string | null, excludeNodeId?: string): string[] {
    .filter((node) => node.layerId === layerId && node.id !== excludeNodeId)
    .map((node) => node.id);

  return syncLayerChildren({
    nodes: diagram.nodes.map((node) => {
      const nextOrder = orderedIds.indexOf(node.id);
      return {
        layout: { ...node.layout, order: nextOrder },
    }),
}
function placeNodeInLayer(
  layout: ArchitectureFlowLayout,
  targetLayerId: string | null,
): ArchitectureDiagram {
  const insertAt = targetIds.findIndex((id) => (layout.nodeFrames.get(id)?.centerX ?? Number.MAX_SAFE_INTEGER) > centerX);
  nextTargetIds.splice(insertAt === -1 ? nextTargetIds.length : insertAt, 0, nodeId);
  const currentNode = diagram.nodes.find((node) => node.id === nodeId);

  next = applyLayerNodeOrder(next, targetLayerId, nextTargetIds);
  if (currentLayerId !== targetLayerId) {
    next = applyLayerNodeOrder(next, currentLayerId, previousIds);

}
function selectedExists(diagram: ArchitectureDiagram, selection: ArchitectureSelection): boolean {
  if (selection.type === "layer") return diagram.layers.some((item) => item.id === selection.id);
  return diagram.edges.some((item) => item.id === selection.id);

  initialDocument,
  categoryId,
  diagramMetaId,
  allVariants,
  initialDocument: DiagramDocument;
  categoryId: string;
  diagramMetaId: string;
  allVariants: StoredVariant[];
  const variantMgr = useVariantManager(diagramMetaId, allVariants, activeVariantId, "system_arch");
  const { markDocumentDirty } = useAutosaveDiagram({
    diagramType: "system_arch",
  });
  const [rawDocument, setRawDocument] = useState<DiagramDocument>(initialDocument);
  const diagramRef = useRef<ArchitectureDiagram | null>(isArchitectureDiagram(initialDocument) ? initialDocument : null);
  const [normalizeError, setNormalizeError] = useState<string | null>(null);
  const [relationshipType, setRelationshipType] = useState<ArchitectureRelationshipType>("request_flow");
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [showExport, setShowExport] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [flowNodes, setFlowNodes, onNodesChangeBase] = useNodesState<Node>([]);
  const hasFitInitialView = useRef(false);
  const [firestoreId, setFirestoreId] = useState<string | null>(null);
    diagramRepository.get(diagramMetaId).then((meta) => {
    }).catch(() => {});
  const { saveToCloud, saving: cloudSaving, error: cloudError, lastSaved } = useSaveDiagram({
    diagramType: "system_arch",
    title: diagramLabel,
    onFirstSave: (newId) => setFirestoreId(newId),

    diagramRef.current = diagram;

    Promise.all(
        const preview = await previewRepository.get(variant.id);
      }),
  }, [variants]);
  useEffect(() => {

      if (!isLegacyArchitectureGraph("system_arch", rawDocument)) {
          setDiagram(rawDocument);
          setHistory([cloneArchitecture(rawDocument)]);
          setNormalizeError(null);
        return;

      setNormalizeError(null);
        const normalized = normalizeLegacyArchitectureGraph(rawDocument as GraphDiagram);
        await replaceCurrentVariantIr(normalized);
        setDiagram(normalized);
        setHistory([cloneArchitecture(normalized)]);
      } catch (error) {
        setNormalizeError((error as Error).message);
      } finally {
      }

    return () => { cancelled = true; };

    setDiagram(next);
    setDirty(true);
    if (pushHistory) {
    }
      setSelection(null);
  }, [markDocumentDirty, selection, setDirty]);
  const withCurrent = useCallback((updater: (current: ArchitectureDiagram) => ArchitectureDiagram, pushHistory: boolean = true) => {
    if (!current) return;
    commit(next, pushHistory);

    setHistory((current) => {
      const nextHistory = current.slice(0, -1);
      setDiagram(previous);
      setDirty(true);
      if (!selectedExists(previous, selection)) setSelection(null);
    });

    if (target.id === currentVariantId) return;
      setSwitchTarget(target);
    }
      await switchVariant(target.id, diagram ?? rawDocument);
      setSelection(null);
  }, [currentVariantId, diagram, isDirty, rawDocument, switchVariant]);
  const doSwitch = useCallback(async (target: StoredVariant) => {
    await switchVariant(target.id, diagram ?? rawDocument);
    setSelection(null);

    if (!switchTarget) return;
  }, [doSwitch, switchTarget]);
  const handleModalSaveCopy = useCallback(() => {
    void (async () => {
      await doSwitch(switchTarget);
  }, [createWorkingCopy, diagram, doSwitch, switchTarget]);
  const handleLayerChange = useCallback((layerId: string, patch: Record<string, unknown>) => {
  }, [withCurrent]);
  const handleMoveLayer = useCallback((layerId: string, direction: -1 | 1) => {
  }, [withCurrent]);
  const handleDeleteLayer = useCallback((layerId: string) => {
  }, [withCurrent]);
  const handleNodeChange = useCallback((nodeId: string, patch: Record<string, unknown>) => {
      const nextLayerId = Object.prototype.hasOwnProperty.call(patch, "layerId")
        : undefined;
      delete remainingPatch.layerId;
      let next = current;
        const appendOrder = orderedNodeIdsForLayer(current, nextLayerId, nodeId).length;
      }
        next = updateArchitectureNode(next, nodeId, remainingPatch as Partial<ArchitectureNode>);
      return next;
  }, [withCurrent]);
  const handleDeleteNode = useCallback((nodeId: string) => {
      ...current,
      edges: current.edges.filter((edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId),
  }, [withCurrent]);
  const handleEdgeChange = useCallback((edgeId: string, patch: Record<string, unknown>) => {
  }, [withCurrent]);
  const handleDeleteEdge = useCallback((edgeId: string) => {
  }, [withCurrent]);
  const layoutResult = useMemo(() => {
    return buildArchitectureFlow(diagram, {
      selectedNodeId: selection?.type === "node" ? selection.id : null,
      onLayerRename: (layerId, name) => handleLayerChange(layerId, { name }),
      onLayerHeightChange: (layerId, height) => handleLayerChange(layerId, { height }),
    });

    if (!layoutResult) return;
    setFlowEdges(layoutResult.edges);

    if (!layoutResult || normalizing || hasFitInitialView.current) return;
    hasFitInitialView.current = true;
  }, [fitView, layoutResult, normalizing]);
  useEffect(() => {
  }, [rawDocument]);
  const addLayerFromToolbar = useCallback(() => {
    if (!current) return;
    const newLayer = next.layers[next.layers.length - 1];
    setSelection({ type: "layer", id: newLayer.id });

    const current = diagramRef.current;
    const shape = getCanvasLibrary("system_arch").shapes.find((item) => item.id === shapeId);
    const targetLayerId = layerForSelection(current, selection);
    const order = orderedNodeIdsForLayer(current, targetLayerId).length;
      ...current,
        ...current.nodes,
          id: nextNodeId,
          type: shape.irType,
          layout: { order },
      ],
    commit(next);
  }, [commit, selection]);
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
  }, [onNodesChangeBase]);
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
  }, [onEdgesChangeBase]);
  const handleConnect = useCallback((connection: Connection) => {
    const current = diagramRef.current;
    const edgeId = newArchitectureId("edge");
      id: edgeId,
      targetHandle: connection.targetHandle ?? undefined,
    commit(next);
  }, [commit, relationshipType]);
  const handleReconnect = useCallback((oldEdge: Edge, connection: Connection) => {
    withCurrent((current) => reconnectArchitectureEdge(
      oldEdge.id,
      connection.target!,
      connection.targetHandle ?? undefined,
    setSelection({ type: "edge", id: oldEdge.id });

    if (node.type === "architectureLayerNode") {
      return;
    setSelection({ type: "node", id: node.id });

    setSelection({ type: "edge", id: edge.id });


    const current = diagramRef.current;
    const size = architectureNodeSize(String((node.data as { nodeType?: string } | undefined)?.nodeType ?? current.nodes.find((item) => item.id === node.id)?.type ?? "process"));
    const centerY = node.position.y + size.height / 2;
    const targetLayerId = targetLayer?.layer.id ?? null;
    commit(next, false);
  }, [commit, layoutResult]);
  const deleteSelected = useCallback(() => {
    if (selection.type === "layer") {
      return;
    if (selection.type === "node") {
      return;
    handleDeleteEdge(selection.id);

    const current = diagramRef.current;
    setAiLoading(true);
    try {
      let next: ArchitectureDiagram;
        next = updated;
        next = normalizeLegacyArchitectureGraph(updated as GraphDiagram);
        throw new Error("Architecture edit returned an invalid document.");
      setAiInstruction("");
    } catch (error) {
        console.error("Architecture AI edit failed.", error);
      setAiError((error as Error).message);
      setAiLoading(false);
  }, [aiInstruction, commit]);
  const exportMermaid = useCallback(async () => {
    if (!current) return;
    const blob = new Blob([mermaid], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = "architecture-diagram.mmd";
    URL.revokeObjectURL(url);
  }, []);
  const exportDrawio = useCallback(async () => {
    if (!current) return;
    const blob = new Blob([xml], { type: "application/xml" });
    const anchor = document.createElement("a");
    anchor.download = "architecture-diagram.drawio";
    URL.revokeObjectURL(url);
  }, []);
  const exportJson = useCallback(() => {
    if (!current) return;
    const url = URL.createObjectURL(blob);
    anchor.href = url;
    anchor.click();
    setShowExport(false);

    return (
        {normalizing ? (
            <Loader2 size={14} className="animate-spin" />
          </div>
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[12px] text-red-600">
          </div>
      </div>
  }
  return (
      <AnimatePresence>
          <SwitchModal
            onReplace={handleModalReplace}
            onCancel={() => setSwitchTarget(null)}
        )}

        <Link href={`/dashboard/${categoryId}/${diagramId}`} className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-800 transition-colors mr-2">
          Back

        <span className="text-[13px] font-semibold text-gray-700">{diagramLabel}</span>
        {isDirty && <span className="text-[10px] text-amber-500 font-medium hidden sm:inline">● Unsaved</span>}
        <div className="flex-1" />
        <div className="flex items-center gap-0.5 border border-gray-200 rounded-xl p-1 bg-gray-50">
            <Layers size={15} />
          <button title="Add component" onClick={() => addNodeFromPalette(getCanvasLibrary("system_arch").shapes[0]?.id ?? "service")} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          </button>
            <Trash2 size={15} />
          <div className="w-px h-5 bg-gray-200 mx-0.5" />
            <ZoomIn size={15} />
          <button title="Zoom out" onClick={() => zoomOut()} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          </button>
            <Maximize2 size={15} />
          <div className="w-px h-5 bg-gray-200 mx-0.5" />
            <Undo2 size={15} />
        </div>
        <button
            const section = document.getElementById("architecture-ai-edit");
            if (!aiInstruction) {
            }
            window.setTimeout(() => input?.focus(), 120);
          className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          <Wand2 size={13} />
        </button>
        <button
            if (!diagram) return;
          }}
          title={cloudError === "unauthenticated" ? "Sign in to save to cloud" : lastSaved ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}` : "Save to Cloud"}
        >
          {cloudSaving ? "Saving…" : cloudError ? "Retry" : lastSaved ? "Saved" : "Save"}

          <button
            className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            <Download size={13} />
          </button>
        </div>

        <ArchitecturePalette
          onRelationshipTypeChange={setRelationshipType}
          onAddNode={addNodeFromPalette}
          activeVariantId={currentVariantId}
          onSwitchVariant={requestSwitchVariant}
        />
        <div className="arch-canvas flex-1 relative min-h-0">
          <ReactFlow
            edges={flowEdges}
            onEdgesChange={handleEdgesChange}
            onReconnect={handleReconnect}
            onEdgeClick={handleEdgeClick}
            onNodeDragStop={handleNodeDragStop}
            edgeTypes={umlEdgeTypes}
            fitView
            multiSelectionKeyCode="Shift"
            nodesDraggable
            proOptions={{ hideAttribution: true }}
          >
            <Controls
                background: "white",
                borderRadius: 12,
              }}
            <MiniMap
                background: "white",
                borderRadius: 12,
              nodeColor={(node) => node.type === "architectureLayerNode" ? "#e2e8f0" : "#3b82f6"}
            />
              <p className="text-[10px] text-gray-400 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-gray-200">
              </p>
          </ReactFlow>
        </div>
        <ArchitectureInspector
          selection={selection}
          onMoveLayer={handleMoveLayer}
          onNodeChange={handleNodeChange}
          onEdgeChange={handleEdgeChange}
          aiInstruction={aiInstruction}
          onApplyAi={applyAiEdit}
          aiError={aiError}
      </div>
  );

  initialDocument: DiagramDocument;
  categoryId: string;
  diagramMetaId: string;
  allVariants: StoredVariant[];
  return (
      <ArchitectureCanvasInner {...props} />
  );
