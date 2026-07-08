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
import { SnapSection } from "@/components/motion/snap-section";

export default function Home() {
  return (
    <>
      <SnapSection>
        <HeroFoto />
      </SnapSection>
      <SnapSection>
        <EjemploReal />
      </SnapSection>
      <SnapSection>
        <StatsBand />
      </SnapSection>
      <SnapSection>
        <Benefits />
      </SnapSection>
      <SnapSection>
        <Sectores />
      </SnapSection>
      <SnapSection>
        <ComoFunciona />
      </SnapSection>
      <SnapSection>
        <PorQueAsicorp />
      </SnapSection>
      <SnapSection>
        <CTASection />
      </SnapSection>
    </>
  );
}
