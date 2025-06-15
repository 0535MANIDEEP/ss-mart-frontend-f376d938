import { useEffect } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "@/api/axios";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";
import ImageUploader from "@/components/ImageUploader";

// Explicitly define form values for strong typing
type FormValues = {
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
};

const AddOrEditProduct = () => {
  const { t } = useTranslation();

  const schema = yup.object({
    name: yup.string().required(t("required")),
    price: yup
      .number()
      .typeError(t("numberRequired"))
      .min(1, t("priceMin"))
      .required(t("required")),
    stock: yup
      .number()
      .typeError(t("numberRequired"))
      .min(0, t("stockNonNegative"))
      .required(t("required")),
    description: yup.string().required(t("required")),
    image: yup.string().url(t("imageUrl")).required(t("required")),
  });

  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      image: "",
    },
    mode: "onTouched"
  });

  useEffect(() => {
    if (!isAuthenticated) return navigate("/admin/login");

    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => {
        // Only set keys that exist in form strictly
        (Object.entries(data) as [keyof FormValues, unknown][]).forEach(([k, v]) => {
          if (["name", "price", "stock", "description", "image"].includes(k)) {
            setValue(
              k,
              v as FormValues[typeof k]
            );
          }
        });
      });
    } else {
      reset({
        name: "",
        price: 0,
        stock: 0,
        description: "",
        image: "",
      });
    }
  }, [isEdit, id, isAuthenticated, navigate, setValue, reset]);

  // Only update the image URL in form when uploader is successful
  const handleImageUpload = (url: string) => {
    setValue("image", url, { shouldDirty: true });
  };

  const imageUrl = watch("image");

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (isEdit) {
      await api.put(`/products/${id}`, values);
    } else {
      await api.post("/products", values);
    }
    navigate("/admin/dashboard");
  };

  if (isEdit && !watch("name")) return <Loader />;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded p-7 shadow animate-fade-in">
      <h2 className="text-xl font-bold mb-6">{isEdit ? t("edit") : t("addProduct")} {t("product")}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-semibold">{t("name")}</label>
          <input {...register("name")} className="w-full border rounded px-3 py-2" />
          {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">{t("price")}</label>
          <input {...register("price")} type="number" className="w-full border rounded px-3 py-2" />
          {errors.price && <span className="text-red-600 text-xs">{errors.price.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">{t("stock")}</label>
          <input {...register("stock")} type="number" className="w-full border rounded px-3 py-2" />
          {errors.stock && <span className="text-red-600 text-xs">{errors.stock.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">{t("imageUrl")}</label>
          <ImageUploader onUpload={handleImageUpload} value={imageUrl} />
          <input {...register("image")} type="hidden" value={imageUrl || ""} />
          {errors.image && <span className="text-red-600 text-xs">{errors.image.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">{t("description")}</label>
          <textarea {...register("description")} className="w-full border rounded px-3 py-2 min-h-20" />
          {errors.description && <span className="text-red-600 text-xs">{errors.description.message}</span>}
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-green-600 w-full text-white py-2 rounded font-bold text-lg hover:bg-green-700 transition"
        >
          {isEdit ? t("saveChanges") : t("addProduct")}
        </button>
      </form>
    </div>
  );
};

export default AddOrEditProduct;
