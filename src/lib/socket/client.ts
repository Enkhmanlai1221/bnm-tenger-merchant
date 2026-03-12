import { RootState } from "@/store";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!socketRef.current && accessToken) {
      socketRef.current = io("", {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        query: {
          token: accessToken,
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnection: true,
      });

      if (process.env.NODE_ENV === "development") {
        socketRef.current.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        socketRef.current.on("connect", () => {
          console.log("Connected to Socket.IO server");
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("Disconnected from Socket.IO server, reason:", reason);
        });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken]);

  return socketRef.current;
};
