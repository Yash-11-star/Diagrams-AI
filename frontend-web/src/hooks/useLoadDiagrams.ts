"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
export interface UseLoadDiagramsReturn {
  loading: boolean;
  
  
}
export function useLoadDiagrams(): UseLoadDiagramsReturn {
  const [diagrams, setDiagrams] = useState<FirestoreDiagram[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
      setDiagrams([]);
    }
    setLoading(true);

      const results = await getUserDiagrams(user.uid);
    } catch (err) {
      setError("Failed to load diagrams. Check your connection and try again.");
      setLoading(false);
  }, [user]);
  useEffect(() => {
  }, [fetch]);
  const remove = useCallback(async (firestoreId: string) => {
      await deleteDiagram(firestoreId);
    } catch (err) {
      throw err;
  }, []);
  return { diagrams, loading, error, refetch: fetch, remove };
