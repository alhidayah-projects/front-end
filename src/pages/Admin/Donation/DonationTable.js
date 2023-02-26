import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { FiCheckSquare, FiSlash } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmptyData from "../../../components/Admin/EmptyData";
import Select from "../../../components/Form/Select";
import CopyToClipboard from "../../../components/UI/CopyToClipboard";
import Pagination from "../../../components/UI/Pagination";
import {
  approveDonationRequest,
  deleteDonationDataById,
  getAllDonationData,
  rejectDonationRequest,
} from "../../../store/actions/donation-action";
import { showAlert } from "../../../store/slices/ui-slice";

const DonationTable = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const dispatch = useDispatch();
  const { items, loading, success, error, pagination } = useSelector(
    (state) => state.donation
  );

  useEffect(() => {
    dispatch(getAllDonationData({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    if (success) {
      dispatch(
        showAlert({
          variant: "success",
          message: success,
        })
      );
    }

    if (error) {
      dispatch(
        showAlert({
          variant: "failed",
          message: error,
        })
      );
    }
  }, [dispatch, success, error]);

  const filterHandler = (value) => {
    setFilterStatus(value);
    if (value === 'all') {
      dispatch(getAllDonationData({}));
    } else {
      dispatch(getAllDonationData({ query: value }));
    }
  };

  const renderRow =
    items?.length === 0 ? (
      <EmptyData span={8} />
    ) : (
      items?.map((item, index) => {
        let statusClass =
          item?.status === "check"
            ? "text-blue-700"
            : item?.status === "approve"
              ? "text-emerald-700"
              : item?.status === "reject"
                ? "text-red-700"
                : "";

        return (
          <tr key={index}>
            <td className="border border-indigo-300 p-2">{item?.donasi_id}</td>
            <td className="border border-indigo-300 p-2">{item?.nama}</td>
            <td className="border border-indigo-300 p-2">
              Rp. {item?.nominal}
            </td>
            <td className="border border-indigo-300 p-2">
              <CopyToClipboard value={item?.email} />
            </td>
            <td className="border border-indigo-300 p-2">
              <CopyToClipboard value={item?.telepon} />
            </td>
            <td
              className={`border border-indigo-300 p-2 text-center font-semibold ${statusClass}`}
            >
              {item?.status}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.created_at}
            </td>
            <td className="border border-indigo-300 border-b-0 p-2 flex flex-row flex-nowrap space-x-1 justify-center items-stretch">
              <button
                disabled={loading || item?.status !== "check"}
                onClick={() => dispatch(approveDonationRequest(item?.id))}
                type="button"
                className="p-3 bg-emerald-300 rounded disabled:bg-slate-200 disabled:text-slate-400"
              >
                <FiCheckSquare size={20} />
              </button>
              <button
                disabled={loading || item?.status !== "check"}
                onClick={() => dispatch(rejectDonationRequest(item?.id))}
                type="button"
                className="p-3 bg-orange-300 rounded disabled:bg-slate-200 disabled:text-slate-400"
              >
                <FiSlash size={20} />
              </button>
              <Link
                to={`/donation/view/${item.id}`}
                className="p-3 bg-gray-300 rounded"
              >
                <AiOutlineEye size={20} />
              </Link>
              <button
                disabled={loading}
                onClick={() => dispatch(deleteDonationDataById(item?.id))}
                type="button"
                className="p-3 bg-red-300 rounded"
              >
                <BiTrashAlt size={20} />
              </button>
            </td>
          </tr>
        );
      })
    );

  return (
    <section className="p-4 rounded bg-white">
      <h2 className="mb-3 font-semibold text-xl underline underline-offset-8 text-indigo-900">
        Tabel Donasi
      </h2>
      <Select
        className="mt-6 w-[200px]"
        label="Filter status:"
        options={{
          onChange: (e) => filterHandler(e.target.value),
          value: filterStatus,
        }}
      >
        <option value="all" selected={filterStatus === 'all'}>Semua</option>
        <option value="check" selected={filterStatus === 'check'}>Check</option>
        <option value="approve" selected={filterStatus === 'approve'}>Approve</option>
        <option value="reject" selected={filterStatus === 'reject'}>Reject</option>
      </Select>
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse border border-slate-400 table-auto">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border border-indigo-300 p-2">ID Donasi</th>
              <th className="border border-indigo-300 p-2">Nama</th>
              <th className="border border-indigo-300 p-2">Nominal</th>
              <th className="border border-indigo-300 p-2">E-Mail</th>
              <th className="border border-indigo-300 p-2">Telepon</th>
              <th className="border border-indigo-300 p-2">Status</th>
              <th className="border border-indigo-300 p-2">Pada Tanggal</th>
              <th className="border border-indigo-300 p-2"></th>
            </tr>
          </thead>
          <tbody>{renderRow}</tbody>
        </table>
      </div>
      <Pagination data={pagination} handler={getAllDonationData} />
    </section>
  );
};

export default DonationTable;
