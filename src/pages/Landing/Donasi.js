import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/Form/Input";
import Select from "../../components/Form/Select";
import TextArea from "../../components/Form/TextArea";
import Breadcrumb from "../../components/UI/Breadcrumb";
import Button from "../../components/UI/Button";
import CopyToClipboard from "../../components/UI/CopyToClipboard";
import { HiInformationCircle } from "react-icons/hi";
import { ImWarning } from "react-icons/im";
import {
	maxLengthPhoneNumber,
	minLengthPhoneNumber,
	normalImageValidate,
	sizeLimit,
} from "../../utils/formValidates";
import Modal from "../../components/UI/Modal";
import { useDispatch, useSelector } from "react-redux";
import { userSendDonation } from "../../store/actions/donation-action";
import { getAllDebit } from "../../store/actions/debit-action";
import { showAlert } from "../../store/slices/ui-slice";
import Spin from "../../components/UI/Spin";

const Donasi = () => {
	const [fieldNominalLainnya, setFieldNominalLainnya] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [data, setData] = useState({});
	const dispatch = useDispatch();
	const { items } = useSelector((state) => state.debit);
	const { loading, success, error } = useSelector((state) => state.donation);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch,
		unregister,
	} = useForm({
		mode: "all",
	});

	let nominal = watch("nominal");

	useEffect(() => {
		dispatch(getAllDebit({}));
	}, [dispatch]);

	useEffect(() => {
		if (nominal === "lainnya") {
			setFieldNominalLainnya(true);
		} else {
			setFieldNominalLainnya(false);
			unregister("nominal_lainnya");
		}
	}, [nominal, unregister]);

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

		setConfirmModal(false);
		reset();
	}, [dispatch, error, reset, success]);

	const onSubmit = (data) => {
		if (!isValid) return;

		setConfirmModal(true);
		setData({
			nama: data?.nama,
			nominal:
				data?.nominal !== "lainnya" ? data?.nominal : data?.nominal_lainnya,
			rekening_id: data?.bank,
			jenis_donasi: data?.jenis_donasi,
			alamat: data?.alamat,
			email: data?.email,
			telepon: data?.whatsapp,
			keterangan: data?.keterangan,
			bukti_pembayaran: data?.bukti_transfer[0],
		});
	};

	const confirmHandler = () => {
		dispatch(userSendDonation(data));
	};

	const renderData = items?.map(
		({ nama_bank, nomor_rekening, atas_nama }, index) => {
			return (
				<li key={index} className="mb-2">
					<div className="flex flex-row gap-4">
						<span className="font-semibold">{nama_bank}:</span>
						<CopyToClipboard value={nomor_rekening} />
					</div>
					<span>a.n. {atas_nama}</span>
				</li>
			);
		}
	);

	return (
		<>
			<Breadcrumb title="Formulir Donasi" />
			<section className="container-custom py-6">
				<h2 className="text-lg font-semibold mb-5">Formulir Donasi</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Select
						options={{
							...register("jenis_donasi", {
								required: "Pilih salah satu opsi jenis donasi",
							}),
						}}
						id="jenis_donasi"
						label="Jenis Donasi"
						errorMessage={errors?.jenis_donasi?.message}
						requireIcon="true"
						hasError={!!errors?.jenis_donasi}
					>
						<option value="sedekah">Sedekah</option>
						<option value="infak">Infak</option>
						<option value="zakat">Zakat</option>
						<option value="dll">Lainnya</option>
					</Select>
					<div className="block lg:flex lg:flex-row lg:gap-3">
						<Select
							options={{
								...register("nominal", {
									required: "Pilih salah satu opsi jenis donasi",
								}),
							}}
							id="nominal"
							label="Nominal"
							errorMessage={errors?.nominal?.message}
							requireIcon="true"
							hasError={!!errors?.nominal}
						>
							<option value="10000">Rp 10.000</option>
							<option value="50000">Rp 50.000</option>
							<option value="100000">Rp 100.000</option>
							<option value="300000">Rp 300.000</option>
							<option value="500000">Rp 500.000</option>
							<option value="lainnya">Lainnya ...</option>
						</Select>
						<Select
							options={{
								...register("bank", {
									required:
										"Pilih salah satu opsi nomor rekening bank milik yayasan",
								}),
							}}
							id="bank"
							label="Pilih Bank"
							errorMessage={errors?.bank?.message}
							requireIcon="true"
							hasError={!!errors?.bank}
						>
							{items?.map(({ nama_bank, nomor_rekening, id }, index) => {
								return (
									<option
										key={index}
										value={id}
									>{`${nama_bank} - ${nomor_rekening}`}</option>
								);
							})}
						</Select>
					</div>
					{fieldNominalLainnya && (
						<Input
							prefix="Rp"
							options={{
								...register("nominal_lainnya", {
									required: "Harap isi nominal donasi anda",
									valueAsNumber: true,
									min: {
										value: 10000,
										message: "Min donasi Rp 10.000",
									},
								}),
								type: "number",
							}}
							id="nominal_lainnya"
							label="Nominal Lainnya"
							requireIcon="true"
							hasError={!!errors?.nominal_lainnya}
							errorMessage={errors?.nominal_lainnya?.message}
						/>
					)}
					<Input
						options={{
							...register("nama", {
								required: "Harap isi Nama Lengkap anda",
							}),
							type: "text",
						}}
						id="nama"
						label="Nama Lengkap"
						requireIcon="true"
						hasError={!!errors?.nama}
						errorMessage={errors?.nama?.message}
					/>
					<TextArea
						id="alamat"
						label="Alamat"
						requireIcon="true"
						errorMessage={errors?.alamat?.message}
						hasError={!!errors?.alamat}
						options={{
							...register("alamat", {
								required: "Harap isi alamat anda",
							}),
							rows: "4",
						}}
					></TextArea>
					<div className="block lg:flex lg:flex-row lg:gap-3">
						<Input
							prefix="+62"
							options={{
								...register("whatsapp", {
									required: "Harap isi nomor whatsapp anda",
									valueAsNumber: true,
									validate: {
										minLength: (value) => minLengthPhoneNumber(value),
										maxLength: (value) => maxLengthPhoneNumber(value),
									},
								}),
								type: "number",
							}}
							id="whatsapp"
							label="Nomor Whatsapp"
							requireIcon="true"
							hasError={!!errors?.whatsapp}
							errorMessage={errors?.whatsapp?.message}
						/>
						<Input
							options={{
								...register("email", {
									required: "Harap isi E-Mail aktif anda",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address",
									},
								}),
								type: "email",
							}}
							id="email"
							label="E-Mail"
							requireIcon="true"
							hasError={!!errors?.email}
							errorMessage={errors?.email?.message}
						/>
					</div>
					<TextArea
						id="keterangan"
						label="Keterangan"
						errorMessage={errors?.keterangan?.message}
						hasError={!!errors?.keterangan}
						options={{
							...register("keterangan"),
							rows: "4",
						}}
					></TextArea>
					<div className="lg:max-w-3xl my-6 py-4 px-2 rounded-lg border-2 border-palette-1">
						<p className="flex gap-2 items-center text-lg mb-4 text-palette-1 font-semibold">
							<span>
								<HiInformationCircle size={30} />
							</span>
							Berikut informasi nomor rekening Yayasan Al-Hidayah Baitul Hatim
						</p>
						<ul className="">{renderData}</ul>
						<Input
							className="mt-10"
							options={{
								...register("bukti_transfer", {
									required: "Harap upload bukti transfer anda",
									validate: {
										extentions: (values) => normalImageValidate(values),
										sizeLimit: (values) => sizeLimit(values),
									},
								}),
								type: "file",
								accept: ".jpg,.jpeg,.png",
							}}
							id="bukti_transfer"
							label="Bukti Pembayaran"
							requireIcon="true"
							hasError={!!errors?.bukti_transfer}
							errorMessage={errors?.bukti_transfer?.message}
						/>
					</div>
					<Button
						className="flex gap-2"
						options={{
							type: "submit",
						}}
					>
						Kirim
					</Button>
				</form>
			</section>
			{confirmModal && (
				<Modal onClose={() => setConfirmModal(false)}>
					<div className="flex justify-center mb-4">
						<div className="bg-blue-200 rounded-full p-3">
							<span>
								<ImWarning className="text-blue-600" size={26} />
							</span>
						</div>
					</div>
					<h3 className="text-lg font-semibold text-center leading-6 text-gray-900">
						Konfirmasi data donasi
					</h3>
					<div className="mt-2">
						<p className="text-sm text-center text-gray-600">
							Pastikan data yang anda masukan sudah benar. Setelah terkirim data
							tidak dapat diubah.
						</p>
					</div>
					<div className="flex flex-col md:flex-row-reverse md:justify-center gap-2 mt-7">
						<button
							disabled={loading}
							onClick={confirmHandler}
							className="flex gap-2 justify-center items-center py-3 px-3 md:px-10 md:py-2 bg-palette-1 text-white rounded font-bold"
						>
							{loading && <Spin />}
							Kirim
						</button>
						<button
							onClick={() => setConfirmModal(false)}
							className="py-2 px-3 border-2 border-gray-300 bg-slate-100 rounded text-gray-600 font-bold"
						>
							Cancel
						</button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default Donasi;
