import TotalUsersIcon from "@/assets/icons/totalUsersIcon.svg?react";
import AnimalOwnersIcon from "@/assets/icons/animalOwnersIcon.svg?react";
import TotalVeterinariansIcon from "@/assets/icons/totalVeterinariansIcon.svg?react";
import TotalStoresIcon from "@/assets/icons/totalStoresIcon.svg?react";
import TotalClinicsIcon from "@/assets/icons/totalClinicsIcon.svg?react";
import TotalPetsIcons from "@/assets/icons/totalPetsIcons.svg?react";

export const usersFeaturesStatistics = [
  {
    id: "total-users",
    label: "Total Users",
    value: "4",
    icon: TotalUsersIcon,
    highlighted: true,
  },
  {
    id: "animal-owners",
    label: "Animal Owners",
    value: "10",
    icon: AnimalOwnersIcon,
    highlighted: false,
  },
  {
    id: "total-veterinarian",
    label: "Total Veterinarian",
    value: "10",
    icon: TotalVeterinariansIcon,
    highlighted: false,
  },
  {
    id: "total-stores",
    label: "Total Stores",
    value: "4",
    icon: TotalStoresIcon,
    highlighted: false,
  },
  {
    id: "total-clinics",
    label: "Total Clinics",
    value: "10",
    icon: TotalClinicsIcon,
    highlighted: false,
  },
  {
    id: "total-pets-farms",
    label: "Total Pets & Farms",
    value: "10",
    icon: TotalPetsIcons,
    highlighted: false,
  },
];
