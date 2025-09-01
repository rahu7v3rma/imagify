import { Link } from '@/components/shared/links';
import { Large } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';

export function Logo() {
  return (
    <Link href={ROUTES.HOME}>
      <Large>imagify.pro</Large>
    </Link>
  );
}
