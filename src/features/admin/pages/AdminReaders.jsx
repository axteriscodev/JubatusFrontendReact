import { Settings } from "lucide-react";
import Button from "@common/components/ui/Button";
import ButtonGroup from "@common/components/ui/ButtonGroup";
import Table from "@common/components/ui/Table";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { ROUTES } from "@/routes";
import { fetchReaders } from "@features/admin/store/admin-readers-actions";

/**
 * Pagina di gestione dei Reader POS Stripe
 *
 * @returns {React.ReactElement} admin readers panel
 */
export default function AdminReaders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const readers = useSelector((state) => state.adminReaders.readers);

  useEffect(() => {
    document.body.classList.add("admin");
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  useEffect(() => {
    dispatch(fetchReaders());
  }, []);

  const handleConfigureReader = (reader) => {
    navigate(ROUTES.ADMIN_READER(reader.id));
  };

  return (
    <div className="container text-left">
      <h1 className="my-10">Elenco Reader POS</h1>
      <Table className="my-10 table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Label</th>
            <th>Stripe ID</th>
            <th>Evento</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {readers.map((reader) => (
            <tr key={reader.id}>
              <td>{reader.id}</td>
              <td>{reader.label}</td>
              <td>{reader.stripeReaderId}</td>
              <td>
                {reader.events.length > 0 ? reader.events[0].slug : "-"}
              </td>
              <td className="text-right">
                <ButtonGroup>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleConfigureReader(reader)}
                  >
                    <Settings size={16} />
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
