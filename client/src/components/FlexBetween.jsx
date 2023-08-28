import {Box} from "@mui/material";
import {styled} from "@mui/system";

//this syntax: good if you are reusing css as a component - called "Styled Components"
//"FlexBetween" can name this component as if its another component
//can pass CSS properties inside
const FlexBetween = styled(Box) ({
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center"
});

export default FlexBetween;


