export type Phase =
  | "idle"
  | "reserving"
  | "reserved"
  | "checking_out"
  | "checked_out"
  | "expired"
  | "error";

export type InventoryState = {
  phase: Phase;
  reservationId: string | null;
  expiresAt: string | null;
  serverNowMs: number;
  message: string;
};

export const initialInventoryState: InventoryState = {
  phase: "idle",
  reservationId: null,
  expiresAt: null,
  serverNowMs: 0,
  message: "",
};

export type InventoryAction =
  | { type: "RESERVE_START" }
  | {
      type: "RESERVE_SUCCESS";
      id: string;
      expiresAt: string;
      serverNowMs: number;
    }
  | { type: "RESERVE_FAILURE"; message: string }
  | { type: "CHECKOUT_START" }
  | { type: "CHECKOUT_SUCCESS" }
  | { type: "CHECKOUT_FAILURE"; message: string }
  | { type: "EXPIRED" }
  | { type: "RESET" };

export function inventoryReducer(
  state: InventoryState,
  action: InventoryAction
): InventoryState {
  switch (action.type) {
    case "RESERVE_START":
      if (state.phase !== "idle") return state;

      return {
        ...state,
        phase: "reserving",
        message: "",
      };

    case "RESERVE_SUCCESS":
      if (state.phase !== "reserving") return state;

      return {
        phase: "reserved",
        reservationId: action.id,
        expiresAt: action.expiresAt,
        serverNowMs: action.serverNowMs,
        message: "Đã giữ hàng thành công.",
      };

    case "RESERVE_FAILURE":
      if (state.phase !== "reserving") return state;

      return {
        ...state,
        phase: "error",
        message: action.message,
      };

    case "CHECKOUT_START":
      if (state.phase !== "reserved") return state;

      return {
        ...state,
        phase: "checking_out",
        message: "",
      };

    case "CHECKOUT_SUCCESS":
      if (
        state.phase !== "checking_out" &&
        state.phase !== "reserved"
      ) {
        return state;
      }

      return {
        ...state,
        phase: "checked_out",
        message: "Đặt hàng thành công.",
      };

    case "CHECKOUT_FAILURE":
      if (state.phase !== "checking_out") return state;

      return {
        ...state,
        phase: "reserved",
        message: action.message,
      };

    case "EXPIRED":
      if (
        state.phase !== "reserved" &&
        state.phase !== "checking_out"
      ) {
        return state;
      }

      return {
        ...state,
        phase: "expired",
        message: "Hết hạn giữ hàng.",
      };

    case "RESET":
      if (
        state.phase === "reserving" ||
        state.phase === "checking_out" ||
        state.phase === "reserved"
      ) {
        return state;
      }

      return initialInventoryState;

    default:
      return state;
  }
}
