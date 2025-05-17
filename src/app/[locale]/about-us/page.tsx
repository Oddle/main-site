import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';

export default function AboutUsPage() {
  const t = useTranslations('aboutUsPage');

  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 md:px-6 max-w-6xl py-8 md:py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">{t('story.title')}</h2>
          <div className="space-y-6 text-gray-700 dark:text-gray-400 leading-relaxed">
            <p>{t('story.paragraph1')}</p>
            <p>{t('story.paragraph2')}</p>
            <p>{t('story.paragraph3')}</p>
          </div>
        </section>

        <section className="mb-16 flex flex-col items-center text-center">
          <div className="relative w-32 h-32 rounded-full mb-4 overflow-hidden bg-gray-300 dark:bg-gray-700">
            <Image
              src="https://ucarecdn.com/992c0582-da95-4db4-9376-fa6f829cc165/-/scale_crop/128x128/smart/"
              alt={t('ceo.imageAlt')}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('ceo.name')}</h3>
          <p className="text-md text-gray-600 dark:text-gray-400">{t('ceo.title')}</p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">{t('values.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">{t('values.value1.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  {t('values.value1.description')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">{t('values.value2.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  {t('values.value2.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 