
import { useEffect } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "@/api/axios";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/store/authStore";

// Explicitly define form values for strong typing
type FormValues = {
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
};

const schema = yup.object({
  name: yup.string().required("Required"),
  price: yup
    .number()
    .typeError("Number required")
    .min(1, "Price must be at least 1")
    .required("Required"),
  stock: yup
    .number()
    .typeError("Number required")
    .min(0, "Non-negative")
    .required("Required"),
  description: yup.string().required("Required"),
  image: yup.string().url("Must be URL").required("Required"),
});

const AddOrEditProduct = () => {
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
      <h2 className="text-xl font-bold mb-6">{isEdit ? "Edit" : "Add"} Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-semibold">Name</label>
          <input {...register("name")} className="w-full border rounded px-3 py-2" />
          {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">Price</label>
          <input {...register("price")} type="number" className="w-full border rounded px-3 py-2" />
          {errors.price && <span className="text-red-600 text-xs">{errors.price.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">Stock</label>
          <input {...register("stock")} type="number" className="w-full border rounded px-3 py-2" />
          {errors.stock && <span className="text-red-600 text-xs">{errors.stock.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">Image URL</label>
          <input {...register("image")} className="w-full border rounded px-3 py-2" />
          {errors.image && <span className="text-red-600 text-xs">{errors.image.message}</span>}
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea {...register("description")} className="w-full border rounded px-3 py-2 min-h-20" />
          {errors.description && <span className="text-red-600 text-xs">{errors.description.message}</span>}
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-green-600 w-full text-white py-2 rounded font-bold text-lg hover:bg-green-700 transition"
        >
          {isEdit ? "Save Changes" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddOrEditProduct;
