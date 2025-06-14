
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "@/api/axios";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  username: yup.string().required("Username required"),
  password: yup.string().required("Password required"),
});

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    const { data } = await api.post("/auth/login", values);
    if (data?.token) {
      login(data.token);
      navigate("/admin/dashboard");
    } else {
      alert("Login failed!");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white rounded shadow p-6 animate-fade-in">
      <h2 className="mb-5 text-2xl font-bold text-center">Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Username</label>
          <input {...register("username")} className="w-full border px-3 py-2 rounded" />
          {errors.username && <div className="text-red-500 text-xs">{errors.username.message}</div>}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input {...register("password")} type="password" className="w-full border px-3 py-2 rounded" />
          {errors.password && <div className="text-red-500 text-xs">{errors.password.message}</div>}
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition"
        >Login</button>
      </form>
    </div>
  );
};

export default Login;
