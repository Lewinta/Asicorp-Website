import { Hero } from "@/components/home/hero";
import {
  Benefits,
  CTASection,
  ComoFunciona,
  PorQueAsicorp,
  Sectores,
  StatsBand,
} from "@/components/home/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBand />
      <Benefits />
      <Sectores />
      <ComoFunciona />
      <PorQueAsicorp />
      <CTASection />
    </>
  );
}
