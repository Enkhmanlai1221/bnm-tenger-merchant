"use client";

import {
  Button,
  Checkbox,
  Divider,
  Input,
  Switch
} from "@heroui/react";
import {
  IconCheck,
  IconDeviceFloppy,
  IconHandStop,
  IconPointer,
  IconTrash,
  IconVectorTriangle,
} from "@tabler/icons-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

// --- CONFIG ---
const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1000;
const GRID_SIZE = 15;
const STORAGE_KEY = "camp-map-v3";
const DEFAULT_UNIT_ICON_SIZE = 18;
const PALETTE_ICON_SIZE = 12;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type UnitStatus = "available" | "booked" | "occupied" | "cleaning";
type ActiveTool = "select" | "pan" | "path";
type UnitType =
  | "ger"
  | "house"
  | "parking"
  | "tower"
  | "big"
  | "wc"
  | "restaurant";

interface Point {
  x: number;
  y: number;
}

interface PathData {
  id: string;
  points: Point[];
}

type ItemTypeDef = {
  type: UnitType;
  label: string;
  icon: string;
  color: string;
  defaultPrice: number;
  defaultIconSize?: number;
};

interface CampUnit {
  id: string;
  type: UnitType;
  x: number;
  y: number;
  label: string;
  status: UnitStatus;
  price: number;
  iconSize: number;
}

const DEFAULT_ITEMS: ItemTypeDef[] = [
  {
    type: "ger",
    label: "Гэр",
    icon: "/icon/ger.svg",
    color: "teal",
    defaultPrice: 150000,
    defaultIconSize: 18,
  },
  {
    type: "house",
    label: "Байшин",
    icon: "/icon/house.svg",
    color: "blue",
    defaultPrice: 250000,
    defaultIconSize: 18,
  },
  {
    type: "wc",
    label: "00 / Душ",
    icon: "/icon/house.svg",
    color: "gray",
    defaultPrice: 0,
    defaultIconSize: 18,
  },
  {
    type: "restaurant",
    label: "Ресторан",
    icon: "/icon/house.svg",
    color: "orange",
    defaultPrice: 0,
    defaultIconSize: 18,
  },
  {
    type: "big",
    label: "Big",
    icon: "/icon/big.svg",
    color: "purple",
    defaultPrice: 0,
    defaultIconSize: 18,
  },
  {
    type: "tower",
    label: "Tower",
    icon: "/icon/tom.svg",
    color: "purple",
    defaultPrice: 0,
    defaultIconSize: 18,
  },
  {
    type: "parking",
    label: "Зогсоол",
    icon: "/icon/parking.svg",
    color: "dark",
    defaultPrice: 5000,
    defaultIconSize: 18,
  },
];

const TYPE_META: Record<UnitType, { label: string; icon: string }> = {
  ger: { label: "Гэр", icon: "/icon/ger.svg" },
  house: { label: "Байшин", icon: "/icon/house.svg" },
  parking: { label: "Зогсоол", icon: "/icon/parking.svg" },
  tower: { label: "Tower", icon: "/icon/tom.svg" },
  big: { label: "Big", icon: "/icon/big.svg" },
  wc: { label: "00 / Душ", icon: "/icon/house.svg" },
  restaurant: { label: "Ресторан", icon: "/icon/house.svg" },
};

const DEFAULT_UNITS: CampUnit[] = [
  { id: "35ddeca7-7d79-4a14-9111-6395913a7e62", type: "ger", x: 540, y: 855, label: "1", status: "available", price: 150000, iconSize: 18 },
  { id: "17ebc658-730b-4fd3-a68e-021697dd5af4", type: "ger", x: 225, y: 390, label: "2", status: "available", price: 150000, iconSize: 18 },
  { id: "275109ae-ff48-4781-8c89-f8199e47cfef", type: "ger", x: 285, y: 390, label: "3", status: "available", price: 150000, iconSize: 18 },
  { id: "23fdce6c-92f0-43e5-9fea-13ecd2eb632b", type: "ger", x: 345, y: 390, label: "4", status: "available", price: 150000, iconSize: 18 },
  { id: "b378fb8e-7ec6-4410-82be-c445bce87218", type: "ger", x: 345, y: 330, label: "5", status: "available", price: 150000, iconSize: 18 },
  { id: "e974080e-b9f1-495a-94dd-be08257d3e8e", type: "ger", x: 285, y: 330, label: "6", status: "available", price: 150000, iconSize: 18 },
  { id: "0af32dc9-7633-4c77-9103-47c108ea8d50", type: "ger", x: 225, y: 330, label: "7", status: "available", price: 150000, iconSize: 18 },
  { id: "f99ef322-f575-4d3a-abeb-bfdfe51dc154", type: "ger", x: 165, y: 330, label: "8", status: "available", price: 150000, iconSize: 18 },
  { id: "b8f39d35-3153-4235-89c5-5a77f25bba97", type: "ger", x: 105, y: 330, label: "9", status: "available", price: 150000, iconSize: 18 },
  { id: "83f32e99-9d41-48ad-a8e3-25d94fd43ef3", type: "ger", x: 45, y: 330, label: "10", status: "available", price: 150000, iconSize: 18 },
  { id: "98f6cf65-eb44-4aaa-b334-2f5bebb385cb", type: "ger", x: 105, y: 180, label: "11", status: "available", price: 150000, iconSize: 18 },
  { id: "a58041e3-4863-4412-849c-84bd6a918974", type: "ger", x: 45, y: 180, label: "12", status: "available", price: 150000, iconSize: 18 },
  { id: "26cda2f3-d93a-4e69-94b7-c35b75809cd1", type: "ger", x: 105, y: 225, label: "13", status: "available", price: 150000, iconSize: 18 },
  { id: "e5a50a74-3fd9-4e7e-a389-bd6970787d91", type: "ger", x: 45, y: 225, label: "14", status: "available", price: 150000, iconSize: 18 },
  { id: "a190a652-239c-4efd-91fa-f0b23f21c2af", type: "ger", x: 45, y: 270, label: "15", status: "available", price: 150000, iconSize: 18 },
  { id: "6772a008-a8d9-4473-bf89-000021b022b6", type: "ger", x: 105, y: 270, label: "16", status: "available", price: 150000, iconSize: 18 },
  { id: "dfd9a752-7115-48e9-b2c3-bd60b17ef74f", type: "ger", x: 165, y: 270, label: "17", status: "available", price: 150000, iconSize: 18 },
  { id: "157d4ec3-9e73-4e63-bbc5-b5ee0f52e837", type: "ger", x: 225, y: 270, label: "18", status: "available", price: 150000, iconSize: 18 },
  { id: "a474973a-9ca4-4110-9cee-3cc391da3836", type: "ger", x: 285, y: 270, label: "19", status: "available", price: 150000, iconSize: 18 },
  { id: "7f449805-445e-4666-be79-415b0bfa186c", type: "ger", x: 345, y: 270, label: "20", status: "available", price: 150000, iconSize: 18 },
  { id: "9b382803-40f7-465e-a03a-56282c4b34c4", type: "ger", x: 195, y: 210, label: "21", status: "available", price: 150000, iconSize: 18 },
  { id: "7bc0f352-0f9f-431b-835f-4b3aa187ec0f", type: "ger", x: 255, y: 210, label: "22", status: "available", price: 150000, iconSize: 18 },
  { id: "0b94da34-fa7c-4b2f-a6e4-2f4c421cff73", type: "ger", x: 315, y: 210, label: "23", status: "available", price: 150000, iconSize: 18 },
  { id: "4da31956-e392-495f-a9d2-bb5f696c9ef6", type: "ger", x: 375, y: 210, label: "24", status: "available", price: 150000, iconSize: 18 },
  { id: "e378d749-a331-4468-8da5-a99edb709bae", type: "ger", x: 345, y: 150, label: "25", status: "available", price: 150000, iconSize: 18 },
  { id: "38631185-d597-4dad-b076-8899b1881ec4", type: "ger", x: 285, y: 150, label: "26", status: "available", price: 150000, iconSize: 18 },
  { id: "d26efc21-dc5d-4b14-b96a-edbac663a93b", type: "ger", x: 225, y: 150, label: "27", status: "available", price: 150000, iconSize: 18 },
  { id: "cce10e52-3df8-4139-9c70-256d0a4bb52a", type: "ger", x: 375, y: 90, label: "28", status: "available", price: 150000, iconSize: 18 },
  { id: "2d9e6184-b177-40de-ae4b-1d878cbdf302", type: "ger", x: 315, y: 90, label: "29", status: "available", price: 150000, iconSize: 18 },
  { id: "591204a8-2354-4c36-bd74-2d1f82f461e5", type: "ger", x: 255, y: 90, label: "30", status: "available", price: 150000, iconSize: 18 },
  { id: "37d3f7e0-c87d-4cae-8381-56ec162c902a", type: "ger", x: 195, y: 90, label: "31", status: "available", price: 150000, iconSize: 18 },
  { id: "665c9c53-ab2d-4129-8467-c0868497818a", type: "ger", x: 165, y: 390, label: "32", status: "available", price: 150000, iconSize: 18 },
  { id: "8e85f94a-0498-4790-9189-0d91f3158118", type: "big", x: 795, y: 90, label: "33", status: "available", price: 0, iconSize: 56 },
  { id: "0a0591cc-618a-4a46-84a3-fd1caed3f306", type: "tower", x: 870, y: 855, label: "34", status: "available", price: 0, iconSize: 18 },
  { id: "3a8d8a07-5337-4a75-865a-608fbc247748", type: "tower", x: 795, y: 240, label: "35", status: "available", price: 0, iconSize: 66 },
  { id: "e05c1570-d5c8-4f60-a3e0-8e767b3d21e9", type: "tower", x: 870, y: 255, label: "36", status: "available", price: 0, iconSize: 50 },
  { id: "02d059a0-2728-459c-82d1-436d9b8dfd61", type: "house", x: 1230, y: 465, label: "37", status: "available", price: 250000, iconSize: 18 },
  { id: "3e094fe4-08b2-4359-8f18-ee69575cc7c9", type: "house", x: 1185, y: 465, label: "38", status: "available", price: 250000, iconSize: 18 },
  { id: "204a6969-7a34-479a-9ad9-90bd5f2b8ed8", type: "house", x: 1140, y: 465, label: "39", status: "available", price: 250000, iconSize: 18 },
  { id: "a45ce007-a782-4229-bfca-59eb9e614fc8", type: "house", x: 1230, y: 405, label: "40", status: "available", price: 250000, iconSize: 18 },
  { id: "7c0367bc-727e-4fb7-b9b8-1de83174f770", type: "house", x: 1185, y: 405, label: "41", status: "available", price: 250000, iconSize: 18 },
  { id: "bce93c92-9a49-47b8-a7e7-0da57381286b", type: "house", x: 1140, y: 405, label: "42", status: "available", price: 250000, iconSize: 18 },
  { id: "707f4c5b-3c95-44d2-8887-f91f6dea7409", type: "house", x: 1230, y: 345, label: "43", status: "available", price: 250000, iconSize: 18 },
  { id: "7d93ea28-9cc0-425f-a03f-cf86bb503b29", type: "house", x: 1185, y: 345, label: "44", status: "available", price: 250000, iconSize: 18 },
  { id: "8c2cde3c-5b9f-404f-a99a-83c28f14f235", type: "house", x: 1140, y: 345, label: "45", status: "available", price: 250000, iconSize: 18 },
  { id: "0bd7bcb1-50a7-4989-8388-2f6d0e785eca", type: "house", x: 1230, y: 285, label: "46", status: "available", price: 250000, iconSize: 18 },
  { id: "7c81a21c-d098-47dd-9085-edff23302d04", type: "house", x: 1185, y: 285, label: "47", status: "available", price: 250000, iconSize: 18 },
  { id: "c0601453-62d4-474d-a0b9-24ab7d51db0c", type: "house", x: 1140, y: 285, label: "48", status: "available", price: 250000, iconSize: 18 },
  { id: "543e74af-5e9a-4605-8657-6c9760ae5e4a", type: "house", x: 1230, y: 225, label: "49", status: "available", price: 250000, iconSize: 18 },
  { id: "adbd9e80-b460-44fb-b371-d000cc2b1f34", type: "house", x: 1185, y: 225, label: "50", status: "available", price: 250000, iconSize: 18 },
  { id: "92ed53fd-3219-400e-968a-414a4cdab728", type: "house", x: 1140, y: 225, label: "51", status: "available", price: 250000, iconSize: 18 },
  { id: "8eefa6a5-1eeb-4c9f-bac6-405299a088d2", type: "house", x: 1230, y: 165, label: "52", status: "available", price: 250000, iconSize: 18 },
  { id: "afb6c706-0f8f-48d7-a1e1-569dc92204d1", type: "house", x: 1185, y: 165, label: "53", status: "available", price: 250000, iconSize: 18 },
  { id: "200d842c-c4f6-472d-b365-7b94e2386172", type: "house", x: 1140, y: 165, label: "54", status: "available", price: 250000, iconSize: 18 },
  { id: "c4c9e7d0-2f8d-4e83-b785-a83f1a1b0bd2", type: "house", x: 1140, y: 105, label: "55", status: "available", price: 250000, iconSize: 18 },
  { id: "d5c0de8e-dc21-4010-a84f-683ed5b1f5a0", type: "house", x: 1185, y: 105, label: "56", status: "available", price: 250000, iconSize: 18 },
  { id: "47b79979-b4e6-4f4d-bbb5-2aaab922e949", type: "house", x: 1230, y: 105, label: "57", status: "available", price: 250000, iconSize: 18 },
  { id: "d4dd3a7a-0af5-4a0a-8da8-0d5b24115284", type: "parking", x: 1155, y: 690, label: "58", status: "available", price: 5000, iconSize: 18 },
  { id: "dbee1cba-85da-4e2b-9e86-0bc532321416", type: "parking", x: 1080, y: 690, label: "59", status: "available", price: 5000, iconSize: 18 },
  { id: "2c894787-4132-45bf-92aa-cbad6a3ffed9", type: "parking", x: 1005, y: 690, label: "60", status: "available", price: 5000, iconSize: 18 },
  { id: "95a6c6a3-6780-43da-8d9d-d96d180a9de8", type: "parking", x: 1155, y: 645, label: "61", status: "available", price: 5000, iconSize: 18 },
  { id: "4df12481-aa0a-4182-94e1-c127889af9be", type: "parking", x: 1080, y: 645, label: "62", status: "available", price: 5000, iconSize: 18 },
  { id: "99489611-22cd-402e-b8ab-d910f14ded7f", type: "parking", x: 1005, y: 645, label: "63", status: "available", price: 5000, iconSize: 18 },
];

const DEFAULT_PATHS: PathData[] = [
  { id: "a3f53fac-4341-40c2-8b68-5289f37992d1", points: [{ x: 195, y: 120 }, { x: 420, y: 120 }] },
  { id: "26df30a5-b506-4e51-8c7d-399d5b50e8e4", points: [{ x: 315, y: 180 }, { x: 420, y: 180 }] },
  { id: "90dc3b67-447b-434d-81b0-6f7dd0eb8f39", points: [{ x: 225, y: 180 }, { x: 315, y: 180 }] },
  { id: "8fa3c29d-1f4e-48c4-9123-084663d4eb29", points: [{ x: 195, y: 240 }, { x: 420, y: 240 }] },
  { id: "bbb7aa21-9f63-48a6-bb71-b5f8e881f679", points: [{ x: 420, y: 270 }, { x: 360, y: 270 }] },
  { id: "2cecefc0-3fbb-4bde-b923-df9a95a1b1ef", points: [{ x: 420, y: 120 }, { x: 420, y: 270 }] },
  { id: "9773df11-12d0-4d18-ad40-d6b7c542c59b", points: [{ x: 420, y: 270 }, { x: 720, y: 270 }] },
  { id: "313e513b-e423-47e5-b954-6779779c8904", points: [{ x: 720, y: 270 }, { x: 720, y: 120 }] },
  { id: "957a49e5-011f-4ebf-907a-83ee6325661b", points: [{ x: 720, y: 105 }, { x: 750, y: 105 }] },
  { id: "1eee5c52-37af-4fa1-a704-7247473b810a", points: [{ x: 720, y: 120 }, { x: 720, y: 105 }] },
  { id: "fa962b9c-0e3d-4005-a3bb-a509b667b663", points: [{ x: 720, y: 270 }, { x: 1080, y: 615 }] },
  { id: "dff3ecd7-dd39-4a1f-9c09-9f08f573c6ee", points: [{ x: 120, y: 225 }, { x: 120, y: 225 }, { x: 120, y: 225 }, { x: 120, y: 225 }, { x: 120, y: 225 }] },
];

export default function CampMapBuilder() {
  const [units, setUnits] = useState<CampUnit[]>(DEFAULT_UNITS);
  const [paths, setPaths] = useState<PathData[]>(DEFAULT_PATHS);
  const [currentPathPoints, setCurrentPathPoints] = useState<Point[]>([]);
  const itemTypes = DEFAULT_ITEMS;
  const itemTypeByKey = useMemo(() => new Map(itemTypes.map((i) => [i.type, i])), [itemTypes]);

  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const draggingRef = useRef(false);
  const dragIdRef = useRef<string | null>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const rafRef = useRef<number | null>(null);
  const lastPointerRef = useRef<{ clientX: number; clientY: number } | null>(null);

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedId) || null,
    [units, selectedId]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        setUnits(DEFAULT_UNITS);
        setPaths(DEFAULT_PATHS);
        return;
      }

      const parsed = JSON.parse(raw);

      if (parsed.units?.length) {
        const loaded: CampUnit[] = (parsed.units as Partial<CampUnit>[]).map((u) => {
          const def = (u.type && itemTypeByKey.get(u.type as UnitType)) || undefined;

          return {
            id: u.id ?? createId(),
            type: (u.type as UnitType) ?? "ger",
            x: u.x ?? 0,
            y: u.y ?? 0,
            label: u.label ?? "",
            status: (u.status as UnitStatus) ?? "available",
            price: u.price ?? def?.defaultPrice ?? 0,
            iconSize: u.iconSize ?? def?.defaultIconSize ?? DEFAULT_UNIT_ICON_SIZE,
          };
        });

        setUnits(loaded);
      } else {
        setUnits(DEFAULT_UNITS);
      }

      if (parsed.paths?.length) {
        setPaths(parsed.paths as PathData[]);
      } else {
        setPaths(DEFAULT_PATHS);
      }
    } catch {
      setUnits(DEFAULT_UNITS);
      setPaths(DEFAULT_PATHS);
    }
  }, [itemTypeByKey]);

  const saveLayout = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ units, paths }));
      alert("Хадгалагдлаа!");
    } catch {
      alert("Хадгалах үед алдаа гарлаа.");
    }
  }, [units, paths]);

  const snap = useCallback(
    (val: number) => (snapToGrid ? Math.round(val / GRID_SIZE) * GRID_SIZE : val),
    [snapToGrid]
  );

  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!transformRef.current || !mapContainerRef.current) {
      return { x: 0, y: 0 };
    }

    const { positionX, positionY, scale } = transformRef.current.instance.transformState;
    const rect = mapContainerRef.current.getBoundingClientRect();

    const x = (clientX - rect.left - positionX) / scale;
    const y = (clientY - rect.top - positionY) / scale;

    return { x, y };
  }, []);

  const setUnitPosition = useCallback((id: string, x: number, y: number) => {
    const nx = clamp(x, 0, CANVAS_WIDTH);
    const ny = clamp(y, 0, CANVAS_HEIGHT);

    setUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, x: nx, y: ny } : u))
    );
  }, []);

  const handleBgClick = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool === "path") {
        const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
        const p = { x: snap(x), y: snap(y) };
        setCurrentPathPoints((prev) => [...prev, p]);
        return;
      }

      if (!draggingRef.current) {
        setSelectedId(null);
        setSelectedPathId(null);
      }
    },
    [activeTool, getCanvasCoordinates, snap]
  );

  const finishPath = useCallback(() => {
    setCurrentPathPoints((prev) => {
      if (prev.length > 1) {
        const newPath: PathData = { id: createId(), points: prev };
        setPaths((p) => [...p, newPath]);
      }
      return [];
    });
  }, []);

  const deletePath = useCallback((id: string) => {
    setPaths((prev) => prev.filter((p) => p.id !== id));
    setSelectedPathId(null);
  }, []);

  const resetLayout = useCallback(() => {
    const ok = window.confirm("Layout-ийг default байдал руу буцаах уу?");
    if (!ok) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { }

    setUnits(DEFAULT_UNITS);
    setPaths(DEFAULT_PATHS);
    setCurrentPathPoints([]);
    setSelectedId(null);
    setSelectedPathId(null);
  }, []);

  const loadDefaultLayout = useCallback(() => {
    setUnits(DEFAULT_UNITS);
    setPaths(DEFAULT_PATHS);
    setCurrentPathPoints([]);
    setSelectedId(null);
    setSelectedPathId(null);
  }, []);

  const onGlobalPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingRef.current || !dragIdRef.current) return;

      lastPointerRef.current = { clientX: e.clientX, clientY: e.clientY };

      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        if (!draggingRef.current || !dragIdRef.current || !lastPointerRef.current) {
          return;
        }

        const { clientX, clientY } = lastPointerRef.current;
        const { x, y } = getCanvasCoordinates(clientX, clientY);
        const { dx, dy } = dragOffsetRef.current;

        setUnitPosition(dragIdRef.current, snap(x - dx), snap(y - dy));
      });
    },
    [getCanvasCoordinates, setUnitPosition, snap]
  );

  const stopDragging = useCallback(() => {
    draggingRef.current = false;
    dragIdRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onGlobalPointerMove);
    window.addEventListener("pointerup", stopDragging);

    return () => {
      window.removeEventListener("pointermove", onGlobalPointerMove);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [onGlobalPointerMove, stopDragging]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleUnitPointerDown = (e: React.PointerEvent, unitId: string) => {
    if (!isAdmin || activeTool !== "select") return;

    e.stopPropagation();
    setSelectedId(unitId);
    setSelectedPathId(null);

    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return;

    dragOffsetRef.current = { dx: x - unit.x, dy: y - unit.y };
    draggingRef.current = true;
    dragIdRef.current = unitId;
  };

  const addItem = (typeKey: UnitType) => {
    const def = itemTypeByKey.get(typeKey);
    if (!def) return;

    const id = createId();

    setUnits((prev) => {
      const newUnit: CampUnit = {
        id,
        type: typeKey,
        x: snap(CANVAS_WIDTH / 2),
        y: snap(CANVAS_HEIGHT / 2),
        label: `${prev.length + 1}`,
        status: "available",
        price: def.defaultPrice,
        iconSize: def.defaultIconSize ?? DEFAULT_UNIT_ICON_SIZE,
      };
      return [...prev, newUnit];
    });

    setSelectedId(id);
    setSelectedPathId(null);
  };

  const bringToFront = useCallback((id: string) => {
    setUnits((prev) => {
      const target = prev.find((u) => u.id === id);
      if (!target) return prev;
      return [...prev.filter((u) => u.id !== id), target];
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setUnits((prev) => {
      const target = prev.find((u) => u.id === id);
      if (!target) return prev;
      return [target, ...prev.filter((u) => u.id !== id)];
    });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col gap-2 p-2 h-[calc(100vh-48px)]">
        <div className="border rounded-lg bg-gray-50 px-3 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Switch
              isSelected={isAdmin}
              onValueChange={setIsAdmin}
              size="sm"
            >
              {isAdmin ? "Админ" : "Харах"}
            </Switch>

            {isAdmin && (
              <>
                <Divider orientation="vertical" className="h-6" />
                <Button
                  isIconOnly
                  size="sm"
                  variant={activeTool === "select" ? "solid" : "bordered"}
                  onPress={() => setActiveTool("select")}
                >
                  <IconPointer size={16} />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant={activeTool === "path" ? "solid" : "bordered"}
                  onPress={() => {
                    setActiveTool("path");
                    setSelectedId(null);
                  }}
                >
                  <IconVectorTriangle size={16} />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant={activeTool === "pan" ? "solid" : "bordered"}
                  onPress={() => setActiveTool("pan")}
                >
                  <IconHandStop size={16} />
                </Button>
              </>
            )}

            {activeTool === "path" && currentPathPoints.length > 0 && (
              <Button
                size="sm"
                color="success"
                startContent={<IconCheck size={14} />}
                onPress={finishPath}
              >
                Замыг дуусгах
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Checkbox
              isSelected={snapToGrid}
              onValueChange={setSnapToGrid}
              size="sm"
            >
              Snap
            </Checkbox>

            <Checkbox
              isSelected={showGrid}
              onValueChange={setShowGrid}
              size="sm"
            >
              Grid
            </Checkbox>

            <Button
              size="sm"
              variant="bordered"
              onPress={loadDefaultLayout}
            >
              Default
            </Button>

            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="light"
              onPress={resetLayout}
              title="Layout reset"
            >
              <IconTrash size={16} />
            </Button>

            <Button
              size="sm"
              color="primary"
              startContent={<IconDeviceFloppy size={14} />}
              onPress={saveLayout}
            >
              Хадгалах
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-1 overflow-hidden">
          {isAdmin && (
            <div className="border rounded-lg bg-white p-3 w-72 shrink-0 overflow-y-auto">
              <p className="text-sm font-semibold mb-3">Барилга нэмэх</p>

              <div className="flex flex-col gap-1">
                {itemTypes.map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded"
                    onClick={() => addItem(item.type)}
                  >
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 shrink-0">
                      <img
                        src={item.icon}
                        width={PALETTE_ICON_SIZE}
                        height={PALETTE_ICON_SIZE}
                        alt={item.label}
                      />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              {selectedUnit && (
                <div className="mt-4">
                  <Divider className="my-2" />
                  <p className="text-xs text-gray-500 text-center mb-2">
                    Сонгосон нэгж
                  </p>

                  <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2 mb-3">
                    <div className="w-8 h-8 rounded bg-white border flex items-center justify-center shrink-0">
                      <img
                        src={TYPE_META[selectedUnit.type].icon}
                        width={16}
                        height={16}
                        alt={TYPE_META[selectedUnit.type].label}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-none">
                        {TYPE_META[selectedUnit.type].label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Type: {selectedUnit.type}
                      </p>
                    </div>
                  </div>

                  <Input
                    size="sm"
                    label="Нэр"
                    value={selectedUnit.label}
                    onChange={(e) =>
                      setUnits((prev) =>
                        prev.map((u) =>
                          u.id === selectedId
                            ? { ...u, label: e.target.value }
                            : u
                        )
                      )
                    }
                  />

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      size="sm"
                      type="number"
                      label="X"
                      value={String(selectedUnit.x)}
                      onChange={(e) => {
                        const next = parseInt(e.target.value || "0", 10);
                        setUnits((prev) =>
                          prev.map((u) =>
                            u.id === selectedId
                              ? {
                                ...u,
                                x: clamp(snap(next), 0, CANVAS_WIDTH),
                              }
                              : u
                          )
                        );
                      }}
                    />
                    <Input
                      size="sm"
                      type="number"
                      label="Y"
                      value={String(selectedUnit.y)}
                      onChange={(e) => {
                        const next = parseInt(e.target.value || "0", 10);
                        setUnits((prev) =>
                          prev.map((u) =>
                            u.id === selectedId
                              ? {
                                ...u,
                                y: clamp(snap(next), 0, CANVAS_HEIGHT),
                              }
                              : u
                          )
                        );
                      }}
                    />
                  </div>

                  <Input
                    className="mt-2"
                    size="sm"
                    type="number"
                    label="Үнэ"
                    value={String(selectedUnit.price)}
                    onChange={(e) => {
                      const next = parseInt(e.target.value || "0", 10);
                      setUnits((prev) =>
                        prev.map((u) =>
                          u.id === selectedId ? { ...u, price: next } : u
                        )
                      );
                    }}
                  />

                  <Input
                    className="mt-2"
                    size="sm"
                    type="number"
                    label="Icon size"
                    min={8}
                    max={128}
                    value={String(selectedUnit.iconSize)}
                    onChange={(e) => {
                      const next =
                        parseInt(e.target.value || `${DEFAULT_UNIT_ICON_SIZE}`, 10) ||
                        DEFAULT_UNIT_ICON_SIZE;

                      setUnits((prev) =>
                        prev.map((u) =>
                          u.id === selectedId
                            ? {
                              ...u,
                              iconSize: clamp(next, 8, 128),
                            }
                            : u
                        )
                      );
                    }}
                  />

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() => selectedId && sendToBack(selectedId)}
                    >
                      Доош
                    </Button>
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() => selectedId && bringToFront(selectedId)}
                    >
                      Дээш
                    </Button>
                  </div>

                  <Button
                    color="danger"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    onPress={() => {
                      setUnits((prev) =>
                        prev.filter((u) => u.id !== selectedId)
                      );
                      setSelectedId(null);
                    }}
                  >
                    Устгах
                  </Button>
                </div>
              )}

              {selectedPathId && (
                <div className="mt-4">
                  <Divider className="my-2" />
                  <p className="text-xs text-gray-500 text-center mb-2">
                    Сонгосон зам
                  </p>

                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    fullWidth
                    startContent={<IconTrash size={14} />}
                    onPress={() => deletePath(selectedPathId)}
                  >
                    Замыг устгах
                  </Button>
                </div>
              )}
            </div>
          )}

          <div
            className="border rounded-lg flex-1 relative overflow-hidden"
            ref={mapContainerRef}
          >
            <TransformWrapper
              ref={transformRef}
              disabled={activeTool === "path"}
              panning={{ disabled: activeTool !== "pan" }}
              minScale={0.4}
              maxScale={4}
              initialScale={1}
              centerOnInit
            >
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <div
                  onClick={handleBgClick}
                  style={{
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                    backgroundColor: "#f8f9fa",
                    backgroundImage: showGrid
                      ? `radial-gradient(#d1d5db 1px, transparent 1px)`
                      : "none",
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    cursor: activeTool === "path" ? "crosshair" : "default",
                    position: "relative",
                  }}
                >
                  <svg width="100%" height="100%">
                    {paths.map((path) => (
                      <polyline
                        key={path.id}
                        points={path.points.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke={selectedPathId === path.id ? "#228be6" : "#DEE2E6"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPathId(path.id);
                          setSelectedId(null);
                        }}
                      />
                    ))}

                    {currentPathPoints.length > 0 && (
                      <polyline
                        points={currentPathPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke="#fab005"
                        strokeWidth="6"
                        strokeDasharray="10,5"
                        strokeLinecap="round"
                      />
                    )}

                    {units.map((unit) => {
                      const def = itemTypeByKey.get(unit.type) || itemTypes[0];
                      const iconSize =
                        unit.iconSize ??
                        def.defaultIconSize ??
                        DEFAULT_UNIT_ICON_SIZE;

                      const foSize = Math.max(16, iconSize + 10);
                      const foHalf = foSize / 2;
                      const isSelected = selectedId === unit.id;

                      return (
                        <g
                          key={unit.id}
                          transform={`translate(${unit.x}, ${unit.y})`}
                          onPointerDown={(e) => handleUnitPointerDown(e, unit.id)}
                          style={{
                            cursor:
                              isAdmin && activeTool === "select"
                                ? "move"
                                : "default",
                          }}
                        >
                          <circle
                            r={foSize / 2}
                            fill="white"
                            stroke={isSelected ? "#3b82f6" : "#d1d5db"}
                            strokeWidth={isSelected ? 2 : 1}
                          />

                          <foreignObject
                            x={-foHalf}
                            y={-foHalf}
                            width={foSize}
                            height={foSize}
                            style={{ pointerEvents: "none" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "100%",
                              }}
                            >
                              <img
                                src={def.icon}
                                width={iconSize}
                                height={iconSize}
                                alt={def.label}
                              />
                            </div>
                          </foreignObject>

                          <text
                            y={foSize / 2 + 14}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="500"
                            fill="#111827"
                          >
                            {unit.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm font-semibold">Тохиргоо</p>

        <Checkbox isSelected={snapToGrid} onValueChange={setSnapToGrid}>
          Snap to grid
        </Checkbox>

        <Checkbox isSelected={showGrid} onValueChange={setShowGrid}>
          Show grid
        </Checkbox>

        <div className="flex gap-2 flex-wrap">
          <Button variant="bordered" onPress={loadDefaultLayout}>
            Default layout
          </Button>

          <Button
            color="danger"
            variant="light"
            startContent={<IconTrash size={16} />}
            className="w-fit"
            onPress={resetLayout}
          >
            Layout reset
          </Button>
        </div>
      </div>
    </div >
  );
}