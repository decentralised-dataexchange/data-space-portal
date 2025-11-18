import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Tooltip } from "@mui/material";

interface Props {
  message: any;
}
const InputQuestionmark = (props: Props) => {
  const { message } = props;
  return (
    <Tooltip title={message} placement="top">
      <HelpOutlineOutlinedIcon
        color="disabled"
        sx={{ marginRight: "auto", fontSize: "17px", cursor: "pointer", marginTop: "-1px" }}
      />
    </Tooltip>
  );
};

export default InputQuestionmark;