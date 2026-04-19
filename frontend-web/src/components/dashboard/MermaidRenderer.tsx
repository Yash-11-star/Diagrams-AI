"use client";
import { useEffect, useRef, useState } from "react";



  const ref = useRef<HTMLDivElement>(null);

    if (!code || !ref.current) return;
    const id = `mermaid-${++idCounter}`;
      .render(id, code)
        if (ref.current) ref.current.innerHTML = svg;
      .catch((e: Error) => setError(e.message));

    return (
        <p className="text-red-500 text-[13px] text-center px-4 max-w-sm">
          {error}
      </div>
  }
  return (
      ref={ref}
    />
}
