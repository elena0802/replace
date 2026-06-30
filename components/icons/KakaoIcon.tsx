import Image from "next/image";

const KAKAO_ICON_SRC = "/images/icons/kakao.svg";

type KakaoIconProps = {
  size?: number;
  className?: string;
};

export default function KakaoIcon({ size = 20, className = "" }: KakaoIconProps) {
  return (
    <Image
      src={KAKAO_ICON_SRC}
      alt=""
      width={size}
      height={size}
      aria-hidden
      unoptimized
      className={className ? `shrink-0 ${className}` : "shrink-0"}
    />
  );
}
