import { useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmptyData from "../../../components/Admin/EmptyData";
import SearchForm from "../../../components/Form/SearchForm";
import Pagination from "../../../components/UI/Pagination";
import {
  deleteChildrenDataById,
  getAllChildrenData,
} from "../../../store/actions/children-action";
import { showAlert } from "../../../store/slices/ui-slice";

const ChildrenTable = () => {
  const dispatch = useDispatch();
  const { items, pagination, success, error } = useSelector(
    (state) => state.children
  );

  useEffect(() => {
    dispatch(getAllChildrenData({}));

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

  const renderRow =
    items?.length === 0 ? (
      <EmptyData span={9} />
    ) : (
      items?.map((item, index) => {
        return (
          <tr key={index}>
            <td className="border border-indigo-300 p-2">{item?.nik}</td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.nama_anak}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.jenis_kelamin === "L"
                ? "Laki-laki"
                : item?.jenis_kelamin === "P"
                  ? "Perempuan"
                  : "Belum ada data"}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.tempat_lahir}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.tanggal_lahir}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.nama_ibu}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.nama_ayah}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.status}
            </td>
            <td className="border border-indigo-300 border-b-0 p-2 flex flex-row flex-nowrap space-x-1 justify-center items-stretch">
              <Link
                to={`/children/update/${item.id}`}
                className="p-3 bg-orange-300 rounded"
              >
                <AiOutlineEdit size={20} />
              </Link>
              <button
                onClick={() => dispatch(deleteChildrenDataById(item?.id))}
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
        Tabel Data Anak
      </h2>
      <div className="mb-3 py-2 flex flex-col flex-wrap gap-3 overflow-x-auto">
        <Link
          className="w-min px-3 py-2 text-[16px] bg-indigo-900 rounded text-white"
          to="/children/add"
        >
          Tambah
        </Link>
        <SearchForm action={getAllChildrenData} />
        <strong>Keterangan:</strong>
        <ol>
          <li>YP (Yatim Piatu)</li>
          <li>TM (Tidak Mampu)</li>
        </ol>
      </div>
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse border border-slate-400 table-auto">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border border-indigo-300 p-2">NIK</th>
              <th className="border border-indigo-300 p-2">Nama Lengkap</th>
              <th className="border border-indigo-300 p-2">Jenis Kelamin</th>
              <th className="border border-indigo-300 p-2">Tempat Lahir</th>
              <th className="border border-indigo-300 p-2">Tanggal Lahir</th>
              <th className="border border-indigo-300 p-2">Nama Ibu</th>
              <th className="border border-indigo-300 p-2">Nama Ayah</th>
              <th className="border border-indigo-300 p-2">Status</th>
              <th className="border border-indigo-300 p-2"></th>
            </tr>
          </thead>
          <tbody>{renderRow}</tbody>
        </table>
      </div>
      <Pagination data={pagination} handler={getAllChildrenData} />
    </section>
  );
};

export default ChildrenTable;
