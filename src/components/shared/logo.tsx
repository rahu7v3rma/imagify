import { Link } from "./links";
import { Large } from "../ui/typography";
import { ROUTES } from "@/constants/routes";

export function Logo() {
  return (
    <Link href={ROUTES.HOME}>
      <Large>imagify.pro</Large>
    </Link>
  );
}
