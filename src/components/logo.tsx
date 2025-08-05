import { ROUTES } from "@/configs/app";
import { Link } from "./links";
import { Large } from "./ui/typography";

export function Logo() {
  return (
    <Link href={ROUTES.HOME}>
      <Large>imagify.pro</Large>
    </Link>
  );
}
