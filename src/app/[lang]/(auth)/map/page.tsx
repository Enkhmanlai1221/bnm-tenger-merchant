"use client";

import {
  IconCalendar,
  IconDoorExit,
  IconHomeCheck,
  IconZoomIn,
  IconZoomOut,
  IconReload,
  IconWand,
  IconCoin,
  IconBed,
  IconUsers,
  IconX
} from "@tabler/icons-react";
import React, { useState, useRef } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

// --- Types & Interfaces ---
type UnitType = "ger" | "house" | "parking" | "tower" | "big" | "wc" | "restaurant";
type UnitStatus = "available" | "booked" | "occupied" | "cleaning";

interface CampUnit {
  id: string;
  type: UnitType;
  x: number;
  y: number;
  label: string;
  status: UnitStatus;
  price: number;
  iconSize?: number;
}

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1000;
const DEFAULT_ICON_SIZE = 18;

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

const PATHS = [
  { "id": "a3f53fac-4341-40c2-8b68-5289f37992d1", "points": [{ "x": 195, "y": 120 }, { "x": 420, "y": 120 }] },
  { "id": "26df30a5-b506-4e51-8c7d-399d5b50e8e4", "points": [{ "x": 315, "y": 180 }, { "x": 420, "y": 180 }] },
  { "id": "90dc3b67-447b-434d-81b0-6f7dd0eb8f39", "points": [{ "x": 225, "y": 180 }, { "x": 315, "y": 180 }] },
  { "id": "8fa3c29d-1f4e-48c4-9123-084663d4eb29", "points": [{ "x": 195, "y": 240 }, { "x": 420, "y": 240 }] },
  { "id": "bbb7aa21-9f63-48a6-bb71-b5f8e881f679", "points": [{ "x": 420, "y": 270 }, { "x": 360, "y": 270 }] },
  { "id": "2cecefc0-3fbb-4bde-b923-df9a95a1b1ef", "points": [{ "x": 420, "y": 120 }, { "x": 420, "y": 270 }] },
  { "id": "9773df11-12d0-4d18-ad40-d6b7c542c59b", "points": [{ "x": 420, "y": 270 }, { "x": 720, "y": 270 }] },
  { "id": "313e513b-e423-47e5-b954-6779779c8904", "points": [{ "x": 720, "y": 270 }, { "x": 720, "y": 120 }] },
  { "id": "957a49e5-011f-4ebf-907a-83ee6325661b", "points": [{ "x": 720, "y": 105 }, { "x": 750, "y": 105 }] },
  { "id": "1eee5c52-37af-4fa1-a704-7247473b810a", "points": [{ "x": 720, "y": 120 }, { "x": 720, "y": 105 }] },
  { "id": "fa962b9c-0e3d-4005-a3bb-a509b667b663", "points": [{ "x": 720, "y": 270 }, { "x": 1080, "y": 615 }] },
  { "id": "dff3ecd7-dd39-4a1f-9c09-9f08f573c6ee", "points": [{ "x": 120, "y": 225 }, { "x": 120, "y": 225 }, { "x": 120, "y": 225 }, { "x": 120, "y": 225 }, { "x": 120, "y": 225 }] },
];

// --- Helper Functions ---
const getStatusColor = (status: UnitStatus): string => {
  switch (status) {
    case "available": return "#40c057";
    case "booked": return "#fd7e14";
    case "occupied": return "#fa5252";
    case "cleaning": return "#228be6";
    default: return "#868e96";
  }
};

const getStatusBgClass = (status: UnitStatus): string => {
  switch (status) {
    case "available": return "bg-green-100 text-green-700";
    case "booked": return "bg-orange-100 text-orange-700";
    case "occupied": return "bg-red-100 text-red-700";
    case "cleaning": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getStatusLabel = (status: UnitStatus): string => {
  switch (status) {
    case "available": return "Сул";
    case "booked": return "Захиалсан";
    case "occupied": return "Хүнтэй";
    case "cleaning": return "Цэвэрлэх";
    default: return status;
  }
};

export default function MobileCampMap() {
  const [units, setUnits] = useState<CampUnit[]>(DEFAULT_UNITS);
  const [opened, setOpened] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<CampUnit | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const handleUnitClick = (unit: CampUnit) => {
    setSelectedUnit(unit);
    setOpened(true);
  };

  const handleClose = () => setOpened(false);

  const handleAction = (action: "book" | "clean" | "empty" | "occupy") => {
    if (!selectedUnit) return;

    const statusMap: Record<typeof action, UnitStatus> = {
      book: "booked",
      clean: "cleaning",
      empty: "available",
      occupy: "occupied",
    };
    const newStatus = statusMap[action];

    setUnits((prev) =>
      prev.map((u) => u.id === selectedUnit.id ? { ...u, status: newStatus } : u)
    );
    setSelectedUnit((prev) => prev ? { ...prev, status: newStatus } : null);
    handleClose();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Map Area */}
      <div className="relative bg-gray-50">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls */}
              <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={() => zoomIn()}
                  className="w-10 h-10 bg-white rounded-full shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform"
                  aria-label="Zoom in"
                >
                  <IconZoomIn size={20} />
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="w-10 h-10 bg-white rounded-full shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform"
                  aria-label="Zoom out"
                >
                  <IconZoomOut size={20} />
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="w-10 h-10 bg-white rounded-full shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform"
                  aria-label="Reset"
                >
                  <IconReload size={20} />
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <div style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
                  >
                    {PATHS.map((path, idx) => (
                      <polyline
                        key={idx}
                        points={path.points.map(p => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke="#e9ecef"
                      />
                    ))}

                    {units.map((unit) => {
                      const def = TYPE_META[unit.type] || TYPE_META.ger;
                      const iconSize = unit.iconSize ?? DEFAULT_ICON_SIZE;

                      return (
                        <g
                          key={unit.id}
                          transform={`translate(${unit.x}, ${unit.y})`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnitClick(unit);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <circle r={iconSize / 2} fill="transparent" />
                          <circle r={iconSize / 2} fill="#f8f9fa" />
                          <foreignObject
                            x={-iconSize / 2}
                            y={-iconSize / 2}
                            width={iconSize}
                            height={iconSize}
                            style={{ pointerEvents: "none" }}
                          >
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                              <img
                                src={def.icon}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                alt=""
                              />
                            </div>
                          </foreignObject>
                          <text y="25" textAnchor="middle" fontSize="10" fontWeight="500">{unit.label}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Drawer Overlay */}
      {opened && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Bottom Drawer */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-in-out ${opened ? "translate-y-0" : "translate-y-full"
          }`}
        style={{ maxHeight: "32rem" }}
      >
        {selectedUnit && (
          <div className="p-4 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "32rem" }}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: getStatusColor(selectedUnit.status) + "22" }}
                >
                  <img
                    src={TYPE_META[selectedUnit.type]?.icon}
                    style={{ width: 28, height: 28 }}
                    alt="icon"
                  />
                </div>
                <div>
                  <p className="font-bold text-base leading-tight">
                    {TYPE_META[selectedUnit.type]?.label} {selectedUnit.label}
                  </p>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${getStatusBgClass(selectedUnit.status)}`}
                  >
                    {getStatusLabel(selectedUnit.status)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <IconX size={16} />
              </button>
            </div>

            <hr className="border-gray-100" />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-gray-200 rounded-xl p-2 bg-gray-50 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <IconCoin size={15} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-semibold">ҮНЭ</span>
                </div>
                <p className="font-bold text-sm">{(selectedUnit.price / 1000).toFixed(0)}k</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-2 bg-gray-50 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <IconBed size={15} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-semibold">ОР</span>
                </div>
                <p className="font-bold text-sm">4</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-2 bg-gray-50 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <IconUsers size={15} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-semibold">ХҮН</span>
                </div>
                <p className="font-bold text-sm">4-6</p>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-400">Үйлдэл сонгох:</p>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAction("book")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${selectedUnit.status === "booked"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                  }`}
              >
                <IconCalendar size={20} />
                Захиалах
              </button>

              <button
                onClick={() => handleAction("clean")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${selectedUnit.status === "cleaning"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
              >
                <IconWand size={20} />
                Цэвэрлэх
              </button>

              <button
                onClick={() => handleAction("empty")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${selectedUnit.status === "available"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
              >
                <IconDoorExit size={20} />
                Суллах
              </button>

              <button
                onClick={() => handleAction("occupy")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${selectedUnit.status === "occupied"
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
              >
                <IconHomeCheck size={20} />
                Хүнтэй
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
