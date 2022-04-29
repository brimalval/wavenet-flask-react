import { SvgIcon, SvgIconProps, Tooltip } from "@mui/material";

const SemibreveIcon = (props: SvgIconProps) => {
  return (
    <Tooltip title="Whole note">
      <SvgIcon
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 165 165"
        xmlSpace="preserve"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M82.5,10C37.009,10,0,42.523,0,82.5S37.009,155,82.5,155S165,122.477,165,82.5S127.991,10,82.5,10z M82.5,125  C53.551,125,30,105.935,30,82.5S53.551,40,82.5,40S135,59.065,135,82.5S111.449,125,82.5,125z"
        />
      </SvgIcon>
    </Tooltip>
  );
};

export default SemibreveIcon;
