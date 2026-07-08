import { HeroFoto } from "@/components/home/hero-foto";
import { EjemploReal } from "@/components/home/ejemplo-real";
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
      <HeroFoto />
      <EjemploReal />
      <StatsBand />
      <Benefits />
      <Sectores />
      <ComoFunciona />
      <PorQueAsicorp />
      <CTASection />
    </>
  );
}
