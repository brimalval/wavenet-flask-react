import { SvgIcon, SvgIconProps, Tooltip } from "@mui/material";

const MinimIcon = (props: SvgIconProps) => {
  return (
    <Tooltip title="Half note">
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
          d="M253.481,0v273.579c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5s37.009,72.5,82.5,72.5  s82.5-32.523,82.5-72.5V0H253.481z M200.981,371.963c-28.949,0-52.5-19.065-52.5-42.5s23.551-42.5,52.5-42.5s52.5,19.065,52.5,42.5  S229.93,371.963,200.981,371.963z"
        />
      </SvgIcon>
    </Tooltip>
  );
};

export default MinimIcon;
