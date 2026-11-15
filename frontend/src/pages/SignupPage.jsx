import { useForm } from "react-hook-form";
function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("firstName")} placeholder="Enter Your Name: " />

      <input {...register("email")} placeholder="Enter Your Email Id: " />

      <input {...register("password")} placeholder="Enter Your Password: " />

      <button type="submit" className="btn btn-soft btn-primary">
        Submit
      </button>
    </form>
  );
}

export default SignupPage;
