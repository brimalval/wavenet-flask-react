import { SvgIcon, SvgIconProps, Tooltip } from "@mui/material";

const SemiquaverIcon = (props: SvgIconProps) => {
  return (
    <Tooltip title="Eighth note">
      <SvgIcon
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 300 300"
        xmlSpace="preserve"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          id="XMLID_2_"
          d="M195,45c-16.542,0-30-13.458-30-30c0-8.284-6.716-15-15-15c-8.284,0-15,6.716-15,15v182.399  c-8.833-4.696-19.075-7.399-30-7.399c-33.084,0-60,24.673-60,55s26.916,55,60,55s60-24.673,60-55V66.928  C173.832,72.051,184.075,75,195,75c16.542,0,30,13.458,30,30c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15  C255,71.916,228.084,45,195,45z"
        />
      </SvgIcon>
    </Tooltip>
  );
};

export default SemiquaverIcon;
