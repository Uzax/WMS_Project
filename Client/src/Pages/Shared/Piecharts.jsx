import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";


const Piecharts = ({ useColor = true , Data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  var PieColors = null;
  if (useColor === true) {
    PieColors = Data.map((item) => item.color);
    console.log(PieColors);
  }
  return (
    <ResponsivePie
      data={Data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      theme={{
        tooltip: {
          container: {
            background: "#ffffff",
            color: "#333333",
            fontSize: 12,
          },
        },
      }}
      valueFormat=" >-"
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={useColor ? PieColors : { scheme: "nivo" }}
      colorBy="index"
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["brighter", "0"]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor= {colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={true}
      arcLabel="value"
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 8]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
    />
  );
};

export default Piecharts;
