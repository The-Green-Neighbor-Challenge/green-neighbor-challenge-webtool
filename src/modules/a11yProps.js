
export default function a11yProps(index) {
    return {
      id: `admin-tab-${index}`,
      'aria-controls': `admin-tabpanel-${index}`,
    };
  }