"use client";
import toastError from "@/errors/toastError";
import api from "@/services/api";
import { useEffect, useState } from "react";

const useTickets = ({
  searchParam,
  pageNumber,
  status,
  date,
  showAll,
  queueIds,
  withUnreadMessages,
}: any) => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [tickets, setTickets] = useState<any>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTickets = async () => {
        try {
          const { data } = await api.get("/tickets", {
            params: {
              searchParam,
              pageNumber,
              status,
              date,
              showAll,
              queueIds,
              withUnreadMessages,
            },
          });
          setTickets(data.tickets);

          let horasFecharAutomaticamente =
            process.env.NEXT_PUBLIC_HOURS_CLOSE_TICKETS_AUTO;

          if (
            status === "open" &&
            horasFecharAutomaticamente &&
            horasFecharAutomaticamente !== "" &&
            horasFecharAutomaticamente !== "0" &&
            Number(horasFecharAutomaticamente) > 0
          ) {
            let dataLimite = new Date();
            dataLimite.setHours(
              dataLimite.getHours() - Number(horasFecharAutomaticamente)
            );

            data.tickets.forEach((ticket: any) => {
              if (ticket.status !== "closed") {
                let dataUltimaInteracaoChamado = new Date(ticket.updatedAt);
                if (dataUltimaInteracaoChamado < dataLimite)
                  closeTicket(ticket);
              }
            });
          }

          setHasMore(data.hasMore);
          setCount(data.count);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };

      const closeTicket = async (ticket: any) => {
        await api.put(`/tickets/${ticket.id}`, {
          status: "closed",
          userId: ticket.userId || null,
        });
      };

      fetchTickets();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    searchParam,
    pageNumber,
    status,
    date,
    showAll,
    queueIds,
    withUnreadMessages,
  ]);

  return { tickets, loading, hasMore, count };
};

export default useTickets;
