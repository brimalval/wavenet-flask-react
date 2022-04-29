import { SvgIcon, SvgIconProps, Tooltip } from "@mui/material";

const CrotchetIcon = (props: SvgIconProps) => {
  return (
    <Tooltip title="Quarter note">
      <SvgIcon
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 401.963 401.963"
        xmlSpace="preserve"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M253.481,0v273.579c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5s37.009,72.5,82.5,72.5  c45.49,0,82.5-32.523,82.5-72.5V0H253.481z"
        />
      </SvgIcon>
    </Tooltip>
  );
};

export default CrotchetIcon;
