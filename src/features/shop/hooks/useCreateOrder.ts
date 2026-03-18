import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useLanguage } from "@common/i18n/LanguageContext";
import { apiRequest } from "@common/services/api-services";
import { cartActions } from "../store/cart-slice";
import { ROUTES } from "@/routes";
import type { CartItem, CartProduct, PreorderPack } from "@/types/cart";

interface CreateOrderPayload {
  items: (CartItem | CartProduct)[];
  preorder?: PreorderPack;
}

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);
  const { currentLanguage } = useLanguage();

  async function createOrder(payload: CreateOrderPayload) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/shop/create-order",
        method: "POST",
        body: JSON.stringify({
          cart: {
            userId: cart.userId,
            eventId: cart.eventId,
            searchId: cart.searchId,
            allPhotos: cart.allPhotos,
            allClips: cart.allClips,
            video: cart.video,
            amount: cart.totalPrice,
            ...payload,
          },
          lang: currentLanguage.acronym,
        }),
        needAuth: true,
      });

      if (!res.ok) throw new Error("Errore durante la creazione della sessione.");

      const result = await res.json();
      const { orderId, isFree, payments } = result.data;

      dispatch(cartActions.updateOrderId(orderId));

      if (isFree) {
        navigate(ROUTES.MAIL_CONFIRMATION, { replace: true });
      } else if (payments?.some((p: { id: number }) => p.id === 2)) {
        navigate(ROUTES.MAIL_CONFIRMATION, {
          replace: true,
          state: { isCash: true, orderId },
        });
      } else {
        navigate(ROUTES.CHECKOUT, {
          replace: true,
          state: { paymentId: payments[0].id, orderId },
        });
      }
    } catch (error) {
      console.error("Errore:", error);
      navigate(ROUTES.CHECKOUT);
    } finally {
      setIsLoading(false);
    }
  }

  return { createOrder, isLoading };
}
