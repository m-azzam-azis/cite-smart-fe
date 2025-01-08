import checkUser from "@/utils/check-user";

export default async function Page() {
  await checkUser();
  return <div>hello</div>;
}
