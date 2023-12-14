const TabPanel = ({ children, value, name, ...rest }: any) => {
  if (value === name) {
    return (
      <div
        role="tabpanel"
        id={`simple-tabpanel-${name}`}
        aria-labelledby={`simple-tab-${name}`}
        {...rest}
      >
        <>{children}</>
      </div>
    );
  } else return null;
};

export default TabPanel;
