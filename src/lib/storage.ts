import { get } from "svelte/store";
import { evaluateAllCells, globalTempo, rawGridData, replaceGrid } from "./store";

interface StoredData {
  grid: string[][];
  globalTempo: number;
}

const storageKey = "beatsheet:grid";

export function saveToLocalStorage(): void {
  const dataToSave: StoredData = {
    grid: get(rawGridData),
    globalTempo: get(globalTempo),
  };

  localStorage.setItem(storageKey, JSON.stringify(dataToSave));
}

export function loadFromLocalStorage(): void {
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    try {
      const data: StoredData = JSON.parse(savedData);
      globalTempo.set(data.globalTempo);
      replaceGrid(data.grid);
      evaluateAllCells();
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }
}

export function exportToFile(): void {
  const dataToExport: StoredData = {
    globalTempo: get(globalTempo),
    grid: get(rawGridData),
  };

  const blob = new Blob([JSON.stringify(dataToExport)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "beatsheet.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromFile(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result;
        if (typeof fileContent === "string") {
          const importedData: StoredData = JSON.parse(fileContent);
          globalTempo.set(importedData.globalTempo);
          replaceGrid(importedData.grid);
          evaluateAllCells();
        }
      } catch (error) {
        console.error("Error importing file:", error);
      }
    };
    reader.readAsText(file);
  }
}
