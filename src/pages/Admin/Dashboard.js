import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../../store/slices/ui-slice";
import { MdCreditCard, MdOutlineArticle, MdPeopleAlt } from "react-icons/md";
import { RiGalleryLine } from "react-icons/ri";
import { getDashboardData } from "../../store/actions/dashboard-action";
import { AiOutlineDollar, AiOutlineEye } from "react-icons/ai";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import EmptyData from "../../components/Admin/EmptyData";
import { getAllDonationData } from "../../store/actions/donation-action";
import { Link } from "react-router-dom";
import Pagination from "../../components/UI/Pagination";

ChartJS.register(ArcElement, Tooltip, Legend);

const CardDashboard = (props) => {
  return (
    <div
      style={{ backgroundImage: "url('/images/bg-pattern.webp')" }}
      className="bg-white bg-center bg-no-repeat bg-cover rounded-lg drop-shadow shadow-slate-900 p-5 mx-3 h-[150px] md:w-[200px] lg:w-[250px]"
    >
      <div className="grid grid-cols-3 grid-flow-row gap-2">
        {props.icon}
        <span className="row-span-3 self-center place-self-center text-[4rem]">
          {props.value}
        </span>
        <p className="col-span-2 font-semibold text-lg">{props.title}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.user);
  const { item } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.user);
  const { items, pagination } = useSelector((state) => state.donation);

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getAllDonationData({ query: "check" }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(
        showAlert({
          variant: "success",
          message: success,
        })
      );
    }
  }, [dispatch, success]);

  const dataChildrenChart = {
    labels: ["Yatim", "Piatu", "Yatim Piatu", "Tidak Mampu"],
    datasets: [
      {
        label: "# Jumlah anak",
        data: [
          item?.anak?.anak_yatim,
          item?.anak?.anak_piatu,
          item?.anak?.anak_yp,
          item?.anak?.anak_tm,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataUserChart = {
    labels: ["Admin", "Pengurus"],
    datasets: [
      {
        label: "# Jumlah user",
        data: [item?.user?.admin, item?.user?.pengurus],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const renderRow =
    items?.length === 0 ? (
      <EmptyData span={8} />
    ) : (
      items?.map((item, index) => {
        return (
          <tr key={index}>
            <td className="border border-indigo-300 p-2">{item?.nama}</td>
            <td className="border border-indigo-300 p-2">
              Rp. {item?.nominal}
            </td>
            <td className="border border-indigo-300 p-2 text-center">
              {item?.created_at}
            </td>
            <td className="border border-indigo-300 border-b-0 p-2 flex flex-row flex-nowrap space-x-1 justify-center items-stretch">
              <Link
                to={`/donation/view/${item.id}`}
                className="p-3 bg-gray-300 rounded"
              >
                <AiOutlineEye size={20} />
              </Link>
            </td>
          </tr>
        );
      })
    );

  return (
    <>
      <h2 className="ml-4 mb-6 text-2xl font-semibold">
        Hay {userInfo?.name} 👋
      </h2>
      <section className="w-full flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-x-1 mg:gap-y-6">
        <CardDashboard
          icon={<MdOutlineArticle className="col-span-2" size={65} />}
          title="Artikel"
          value={item?.article}
        />
        <CardDashboard
          icon={<RiGalleryLine className="col-span-2" size={65} />}
          title="Galeri"
          value={item?.gallery}
        />
        <CardDashboard
          icon={<MdPeopleAlt className="col-span-2" size={65} />}
          title="Pengurus"
          value={item?.pengurus}
        />
        <CardDashboard
          icon={<MdPeopleAlt className="col-span-2" size={65} />}
          title="Anak"
          value={item?.anak.total_anak}
        />
        <CardDashboard
          icon={<MdPeopleAlt className="col-span-2" size={65} />}
          title="User"
          value={item?.user.total_user}
        />
        <CardDashboard
          icon={<MdCreditCard className="col-span-2" size={65} />}
          title="Rekening"
          value={item?.rekening}
        />
        <CardDashboard
          icon={<AiOutlineDollar className="col-span-2" size={65} />}
          title="Donasi"
          value={item?.donasi.donate}
        />
      </section>
      <section className="w-full grid grid-cols-1 md:grid-cols-4 grid-flow-row gap-4 mt-10">
        <div className="col-auto md:col-start-1 md:col-end-3 rounded-lg bg-white drop-shadow p-4 min-h-[300px]">
          <h6 className="text-lg font-semibold text-center mb-6">
            Donasi Masuk
          </h6>
          {/* <p className="text-lg mb-2"> */}
          {/* 	Total Donasi Keseluruhan: Rp.{" "} */}
          {/* 	<span className="font-semibold">{item?.donasi?.total}</span> */}
          {/* </p> */}
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse border border-slate-400 table-auto">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border border-indigo-300 p-2">Nama</th>
                  <th className="border border-indigo-300 p-2">Nominal</th>
                  <th className="border border-indigo-300 p-2">Pada Tanggal</th>
                  <th className="border border-indigo-300 p-2"></th>
                </tr>
              </thead>
              <tbody>{renderRow}</tbody>
            </table>
          </div>
          <Pagination data={pagination} handler={getAllDonationData} />
        </div>
        <div className="col-auto rounded-lg bg-white drop-shadow p-4">
          <div className="flex flex-col gap-2 min-h-[200px]">
            <span className="text-lg font-semibold text-center">
              Chart Anak
            </span>
            <Doughnut data={dataChildrenChart} />
          </div>
        </div>
        <div className="col-auto rounded-lg bg-white drop-shadow p-4">
          <div className="flex flex-col gap-2 min-h-[200px]">
            <span className="text-lg font-semibold text-center">
              Chart User
            </span>
            <Doughnut data={dataUserChart} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
