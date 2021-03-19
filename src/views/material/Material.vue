<template>
  <div>
    <MaterialNavigation />
    <MaterialDashboard />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";
import MaterialDashboard from "@/components/material/MaterialDashboard";

export default {
  name: "Material",
  components: {
    MaterialNavigation,
    MaterialDashboard,
  },
};
</script>
