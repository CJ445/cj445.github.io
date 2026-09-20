import type { ReactNode } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { benchmark } from '../../data/portfolio';
import Footer from '../layout/Footer';
import ThemeToggle from '../ui/ThemeToggle';
import { TagList } from '../ui/Tag';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const toc = [
  { id: 'challenge', label: 'The challenge' },
  { id: 'approach', label: 'Our approach' },
  { id: 'candidates', label: 'Two candidates' },
  { id: 'results', label: 'Results' },
  { id: 'quality', label: 'Judging without a reference' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'sources', label: 'Sources' },
];

const glance = [
  { label: 'Event', value: 'BAH 2025 · ISRO & InDEA' },
  { label: 'Placed', value: '4th nationally' },
  { label: 'PSNR', value: '41.45 dB' },
  { label: 'SSIM', value: '0.97' },
];

const pipeline = [
  { step: 'Two captures', text: 'Low-resolution frames of one scene, shifted slightly by the satellite’s orbital drift.' },
  { step: 'Align and fuse', text: 'ShiftNet registration and recursive fusion on track 1, Swin attention on track 2.' },
  { step: 'Reconstruct', text: 'A single 512×512 high-resolution image.' },
  { step: 'Assess', text: 'A reference-free score for what PSNR and SSIM miss.' },
];

const comparison: { row: string; a: string; b: string }[] = [
  { row: 'Backbone', a: 'HRNet with ShiftNet, a CNN encoder-decoder', b: 'SwinIR transformer, 120K parameters, 6.8 ms inference' },
  { row: 'Training input', a: '128 px patches', b: 'Full images' },
  {
    row: 'Optimization',
    a: 'AdamW with ReduceLROnPlateau. 50 Optuna trials (TPE) over learning rate, batch size, optimizer, scheduler, gradient clipping and weight decay',
    b: 'Composite loss (MSE, SSIM, edge gradient, perceptual). Fixed 2×10⁻⁴ learning rate, with the decoder head at twice the backbone rate',
  },
  { row: 'Epochs', a: '84', b: '33' },
  { row: 'PSNR / SSIM', a: '40.5 dB / 0.96', b: '41.45 dB / 0.97' },
];

const findings = [
  {
    title: 'The loss mattered more than the search',
    text: 'Adding edge and gradient terms to MSE was the single most valuable change. It stopped the over-smoothing that SSIM penalizes on super-resolved imagery, and it is what moved SSIM from 0.96 to 0.97.',
  },
  {
    title: 'Attention suited satellite texture',
    text: 'The CNN track needed 84 epochs to reach 40.5 dB. The Swin track reached 41.45 dB in 33, so windowed attention over image patches transferred well to this kind of scene.',
  },
  {
    title: 'High PSNR can still look soft',
    text: 'Working on the quality model made this concrete: optimizing PSNR alone can give strong scores and visibly blurry images, which influenced how we approached the blind test.',
  },
];

const nextSteps = [
  'Fix the optimizer to AdamW from the start. Letting Optuna choose it spent trials on SGD runs that were never going to compete.',
  'Tune the edge-gradient loss weight with its own Optuna study rather than by hand. That could lift SSIM beyond 0.97 with no extra training.',
];

const sources = [
  'Deudon, M. et al. (2020). HighRes-net: Recursive Fusion for Multi-Frame Super Resolution of Satellite Imagery. ICLR 2020.',
  'Liang, J. et al. (2021). SwinIR: Image Restoration Using Swin Transformer. ICCV 2021 Workshops.',
  'Akiba, T. et al. (2019). Optuna: A Next-generation Hyperparameter Optimization Framework. KDD 2019.',
];

const Block = ({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) => (
  <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-8">
    <p className="text-xs uppercase tracking-[2px] text-primary/60">{n}</p>
    <h2 id={`${id}-h`} className="mt-2 text-[clamp(1.4rem,2vw,1.8rem)] font-normal leading-tight tracking-[-0.03em]">
      {title}
    </h2>
    <div className="mt-6 space-y-5">{children}</div>
  </section>
);

const P = ({ children }: { children: ReactNode }) => <p className="leading-7 text-secondary">{children}</p>;

const psnrMax = 45;

const SatelliteReport = () => (
  <div className="min-h-screen overflow-x-hidden bg-surface selection:bg-accent/30">
    <header>
      <div className="mx-auto w-full max-w-[70.9rem]">
        <div className="hero-banner relative overflow-hidden rounded-b-[2rem]">
          <div aria-hidden="true" className="hero-glow" />
          <div aria-hidden="true" className="grid-overlay" />
          <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-8 sm:px-7 sm:pb-20">
            <div className="flex items-center justify-between">
              <a href={asset('')} className="inline-flex min-h-10 items-center gap-2 text-sm text-secondary hover:text-primary">
                <FaArrowLeft aria-hidden="true" className="text-xs" /> Back to portfolio
              </a>
              <ThemeToggle />
            </div>
            <p className="mt-10 text-xs uppercase tracking-[2px] text-primary/60">Case study · Team HumbleOps</p>
            <h1 className="mt-3 max-w-3xl text-[clamp(1.8rem,3.4vw,2.75rem)] font-normal leading-[1.1] tracking-[-0.03em]">
              Two blurry satellite frames in, one sharp image out
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-secondary">
              How we built a multi-frame super-resolution model and a blind quality scorer for ISRO’s Bharatiya
              Antariksh Hackathon, and finished 4th in the country.
            </p>
            <div className="mt-6">
              <TagList tags={['SwinIR', 'HighRes-Net', 'Optuna', 'Blind IQA', 'GeoTIFF', 'PyTorch']} />
            </div>
          </div>
        </div>
      </div>
    </header>

    <div className="mx-auto w-full max-w-[70.9rem]">
      <div className="border-x border-primary/10">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:px-7 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-[1.75rem] border border-primary/10 bg-raised p-5 shadow-sm">
              <h2 className="text-xs font-normal uppercase tracking-[2px] text-primary/60">At a glance</h2>
              <dl className="mt-4 space-y-3">
                {glance.map((g) => (
                  <div key={g.label}>
                    <dt className="text-xs text-secondary">{g.label}</dt>
                    <dd className="text-sm">{g.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 border-t border-dashed border-primary/10 pt-4">
                <p className="text-xs text-secondary">Team</p>
                <p className="mt-1 text-sm leading-6">Ayush R David, Cyril Jacob, Basil Shaji</p>
              </div>
            </div>
            <nav aria-label="On this page" className="mt-6 hidden lg:block">
              <ul className="space-y-2 border-l border-primary/10 pl-4 text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-secondary hover:text-primary">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="min-w-0 space-y-16">
            <Block id="challenge" n="01" title="The challenge">
              <P>
                A satellite never sits perfectly still, so two captures of the same ground differ by a fraction of a
                pixel. That offset is useful: each frame contains detail the other lacks, and combining them can beat
                the resolution of the sensor itself.
              </P>
              <P>
                Problem Statement 12 asked for two things. First, a model that fuses a pair of low-resolution frames into
                a higher-resolution image (ours outputs 512×512). Second, a way to judge the result without a
                reference, because the usual metrics, PSNR and SSIM, do not always agree with what a person sees. An
                image can score well and still look soft.
              </P>
            </Block>

            <Block id="approach" n="02" title="Our approach">
              <P>We ran two model families through the same four-stage pipeline.</P>
              <ol className="grid gap-3 sm:grid-cols-2">
                {pipeline.map((s, i) => (
                  <li key={s.step} className="flex gap-4 rounded-2xl border border-primary/10 bg-primary/[0.03] p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-surface">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{s.step}</p>
                      <p className="mt-1 text-sm leading-6 text-secondary">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>

            <Block id="candidates" n="03" title="Two candidates, head to head">
              <P>
                Track 1 tuned a HighRes-Net-style model with a large Optuna search. Track 2 built an enhanced dual
                SwinIR around a hand-designed loss. Both were trained on the same task and compared on the same
                metrics.
              </P>
              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-raised text-sm">
                <div className="hidden grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] border-b border-primary/10 text-xs sm:grid">
                  <span className="px-4 py-3" />
                  <span className="px-4 py-3 font-medium text-secondary">Track 1: Optuna HighRes-Net</span>
                  <span className="bg-accent/10 px-4 py-3 font-medium text-accent">Track 2: Dual SwinIR (submitted)</span>
                </div>
                <ul>
                  {comparison.map((c) => (
                    <li
                      key={c.row}
                      className="grid gap-x-0 border-b border-dashed border-primary/10 last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)]"
                    >
                      <span className="px-4 pt-3 text-xs text-secondary sm:py-3">{c.row}</span>
                      <span className="px-4 py-2 leading-6 sm:py-3">
                        <span className="block text-xs text-secondary sm:hidden">Track 1</span>
                        {c.a}
                      </span>
                      <span className="bg-accent/5 px-4 py-2 leading-6 sm:py-3">
                        <span className="block text-xs text-accent sm:hidden">Track 2 (submitted)</span>
                        {c.b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-secondary">Track 1’s PSNR varied from 30 to 75 dB across its 541 test images.</p>
            </Block>

            <Block id="results" n="04" title="Results">
              <P>
                Against published baselines, the submitted model landed level with the strongest one on PSNR and ahead
                of it on SSIM. Bars show PSNR out of 45 dB.
              </P>
              <ul className="space-y-3" aria-label="PSNR and SSIM by model">
                {benchmark.map((b) => (
                  <li key={b.model} className="grid gap-1 sm:grid-cols-[11rem_minmax(0,1fr)_9rem] sm:items-center sm:gap-4">
                    <span className={`text-sm ${b.ours ? 'font-medium' : ''}`}>{b.model}</span>
                    <span aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-primary/[0.06]">
                      <span
                        className={`block h-full rounded-full ${b.ours ? 'bg-accent' : 'bg-primary/25'}`}
                        style={{ width: `${(Number(b.psnr) / psnrMax) * 100}%` }}
                      />
                    </span>
                    <span className="text-xs tabular-nums text-secondary sm:text-right">
                      {b.psnr} dB · SSIM {b.ssim}
                    </span>
                  </li>
                ))}
              </ul>
              <figure className="pt-2">
                <img
                  src={asset('images/projects/satellite-sr.webp')}
                  alt="The same street shown three ways: super-resolved output (SR), high-resolution reference (HR) and low-resolution input (LR)."
                  loading="lazy"
                  className="dim-dark w-full rounded-2xl border border-primary/10"
                />
                <figcaption className="mt-2 text-xs text-secondary">
                  Super-resolved output (SR), the high-resolution reference (HR) and the low-resolution input (LR) for
                  the same area.
                </figcaption>
              </figure>
            </Block>

            <Block id="quality" n="05" title="Judging quality without a reference">
              <P>
                To score outputs when no ground truth is available, we trained a blind quality model on{' '}
                <span className="text-primary">17,344 image pairs</span> built from 1,084 scenes: each scene has one
                high-resolution reference and 16 degraded variants.
              </P>
              <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-4">
                <p className="text-xs uppercase tracking-[2px] text-primary/60">How the dataset was built</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm tabular-nums">
                  <span>1,084 scenes</span>
                  <FaArrowRight aria-hidden="true" className="text-xs text-secondary" />
                  <span>× 16 variants</span>
                  <FaArrowRight aria-hidden="true" className="text-xs text-secondary" />
                  <span className="font-medium">17,344 pairs</span>
                </p>
                <p className="mt-3 text-sm leading-6 text-secondary">
                  Variants apply Gaussian blur, motion blur, misalignment, jitter and noise, each at three severities.
                </p>
              </div>
              <P>
                The model is a ViT and ResNet-50 hybrid trained as a dual-mode regressor, so it can score an image with
                or without a reference. We also measured outputs with two classic no-reference metrics, NIQE and BRISQUE.
                Both rated the SwinIR outputs as structurally sharper than interpolation, which confirmed that the SSIM
                gain reflected a real perceptual improvement.
              </P>
            </Block>

            <Block id="lessons" n="06" title="Lessons">
              <ol className="space-y-5">
                {findings.map((f, i) => (
                  <li key={f.title} className="flex gap-4">
                    <span aria-hidden="true" className="text-2xl leading-none text-primary/25 tabular-nums">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-medium">{f.title}</h3>
                      <p className="mt-1 leading-7 text-secondary">{f.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="rounded-2xl border border-primary/10 p-5">
                <h3 className="text-xs font-normal uppercase tracking-[2px] text-primary/60">If we did it again</h3>
                <ul className="mt-3 space-y-2">
                  {nextSteps.map((n) => (
                    <li key={n} className="flex items-start gap-2 leading-7 text-secondary">
                      <span aria-hidden="true">•</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </Block>

            <Block id="sources" n="07" title="Sources">
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-secondary">
                {sources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </Block>
          </article>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SatelliteReport;
