import Link from "next/link";
import LanguageSwitcher from "../lang-switcher";

const AuthHeader = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Link href="/" aria-label="Home" className="w-[154px] flex-none">
          TENGER WEBSITE
          {/* <Image
            src={"/sitelogo.png"}
            width={270}
            height={63}
            alt=""
            priority
            className="w-[270px] h-auto"
          /> */}
        </Link>
        <div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export { AuthHeader };
