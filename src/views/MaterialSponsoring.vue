<template>
  <div>
    <MaterialNavigation />
    <MaterialSponsoringList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import MaterialSponsoringList from "@/components/MaterialSponsoringList";

export default {
  name: "MaterialSponsoring",
  components: {
    MaterialNavigation,
    MaterialSponsoringList,
  },
};
</script>
