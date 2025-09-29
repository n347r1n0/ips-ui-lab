// frontend/src/App.jsx

import React, { useState } from 'react';

// — Layout (обёртки страницы/секций/тулбара)
import { PageShell } from './ui/layout/PageShell';
import { Section } from './ui/layout/Section';
import { Toolbar } from './ui/layout/Toolbar';

// — Surfaces (поверхности)
import { GlassPanel } from './ui/surfaces/GlassPanel';
import { Modal } from './ui/surfaces/Modal';
import { Drawer } from './ui/surfaces/Drawer';
import { Card } from './ui/surfaces/Card';

// — Primitives (атомарные элементы)
import { Button } from './ui/primitives/Button';
import { Input } from './ui/primitives/Input';
import { Select } from './ui/primitives/Select';

// — Feedback (состояния/лоадеры/сообщения)
import { Spinner } from './ui/feedback/Spinner';
import { EmptyState } from './ui/feedback/EmptyState';
import { ErrorState } from './ui/feedback/ErrorState';
import { useToast } from './ui/surfaces/Toast';
import { Skeleton, SkeletonLines } from './ui/feedback/Skeleton';
import { LoadingOverlay } from './ui/feedback/LoadingOverlay';

// — Demos / прочее
import { FontsModal } from './ui/demos/FontsModal';
import { Inbox } from 'lucide-react';

export default function App() {
  // — UI state
  const [open, setOpen] = useState(false);                 // модалка формы
  const [fontsOpen, setFontsOpen] = useState(false);       // модалка шрифтов
  const [drawerOpen, setDrawerOpen] = useState(false);     // выезжающий Drawer
  const [loadingWide, setLoadingWide] = useState(false);   // overlay на широкой панели

  // — Form state
  const [saving, setSaving] = useState(false);             // overlay в модалке при сохранении
  const [form, setForm] = useState({ name: '', contactType: 'telegram', contact: '' });
  const [errors, setErrors] = useState({});

  // — Demo data (для EmptyState)
  const [items, setItems] = useState([]);

  // — Имитация загрузки списка (overlay поверх панели со списком)
  const [listLoading, setListLoading] = useState(false);
  const loadItems = () => {
    setListLoading(true);
    setTimeout(() => {
      setItems(['Элемент 1', 'Элемент 2', 'Элемент 3']);
      setListLoading(false);
    }, 1200);
  };

  // — Toast API
  const toast = useToast();

  // — Submit формы в модалке
  const onSave = (e) => {
    e.preventDefault();

    // простая валидация
    const next = {};
    if (!form.name.trim()) next.name = 'Введите имя';
    if (!form.contact.trim()) next.contact = 'Укажите контакт';
    setErrors(next);

    if (Object.keys(next).length) {
      toast.danger(Object.values(next)[0], { title: 'Ошибка валидации' });
      return;
    }

    // имитация сохранения
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      toast.success('Данные успешно сохранены!', { title: 'Успех' });
    }, 1000);
  };

  return (
    // — Корневая «материнская» обёртка страницы (центровка, max-width из токена)
    <PageShell maxW="token" padded>

      {/* ──────────────────────────────────────────────────────────────
          СЕКЦИЯ 1: Базовые панели/кнопки/модалки + демо EmptyState/Card
      ─────────────────────────────────────────────────────────────── */}
      <Section y="default">
        {/* — Верхняя карточка с набором кнопок/вызовов модалок */}
        <GlassPanel className="max-w-md p-6">
          <h1 className="font-brand text-2xl font-bold text-[--fg-strong]">IPS UI Lab</h1>
          <p className="text-[--fg] opacity-80 mt-1">
            Токены, стекло, кнопки, модалки — в песочнице.
          </p>

          {/* — Набор кнопок (Primary/Cancel/Neutral + модалки/дровер) */}
          <div className="flex gap-2 mt-4">
            <Button>Primary</Button>
            <Button variant="glass">Cancel</Button>
            <Button variant="neutral">Neutral</Button>

            {/* — Открыть форму в модалке */}
            <Button onClick={() => setOpen(true)} className="ml-auto">
              Open modal
            </Button>

            {/* — Открыть модалку со шрифтами */}
            <Button variant="glass" onClick={() => setFontsOpen(true)}>
              Fonts modal
            </Button>

            {/* — Открыть Drawer (выезжающая панель) */}
            <Button variant="glass" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
          </div>
        </GlassPanel>

        {/* — Демо EmptyState / список «items» + overlay загрузки */}
        <GlassPanel className="relative max-w-md p-6 mt-6">
          {/* — Полупрозрачная вуаль поверх панели при загрузке списка */}
          <LoadingOverlay show={listLoading} />

          <div className="text-[--fg-strong] font-semibold mb-3">EmptyState demo</div>

          {items.length === 0 ? (
            // — Состояние «пусто»
            <EmptyState
              icon={Inbox}
              title="Пока здесь пусто"
              subtitle="Добавьте первый элемент или откройте модалки."
              action={
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setItems(['Элемент 1'])}>Добавить</Button>
                  <Button variant="glass" onClick={() => setOpen(true)}>Открыть форму</Button>
                  <Button variant="glass" onClick={() => setFontsOpen(true)}>Открыть FontsModal</Button>
                  <Button variant="glass" onClick={loadItems}>Загрузить список</Button>
                </div>
              }
            />
          ) : (
            // — Список элементов + действия
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  {it}
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <Button variant="glass" onClick={() => setItems([])}>Очистить</Button>
                <Button onClick={() => setItems(prev => [...prev, `Элемент ${prev.length + 1}`])}>
                  Добавить
                </Button>
                <Button variant="glass" onClick={loadItems}>Перезагрузить</Button>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* — Демо Card: стеклянная + сплошная */}
        <GlassPanel className="max-w-md p-6 mt-6">
          <div className="text-[--fg-strong] font-semibold mb-3">Card demo</div>

          {/* — Вариант «glass» */}
          <Card variant="glass" padding="md" elevation="s" className="mb-4">
            <Card.Header>
              <div className="font-semibold text-[--fg-strong]">Стеклянная карточка</div>
              <Button variant="glass">Действие</Button>
            </Card.Header>
            <Card.Body>
              Небольшой текст внутри карточки. Это «поверхность» для блоков с контентом.
            </Card.Body>
            <Card.Footer>
              <Button variant="glass">Отмена</Button>
              <Button>Ок</Button>
            </Card.Footer>
          </Card>

          {/* — Вариант «solid» */}
          <Card variant="solid" padding="lg" elevation="m">
            <Card.Header>
              <div className="font-semibold text-[--fg-strong]">Сплошная карточка</div>
            </Card.Header>
            <Card.Body>
              Вариант с фоном <code className="font-mono">--bg-1</code>, без стекла.
            </Card.Body>
          </Card>
        </GlassPanel>

        {/* — Демо ErrorState (широкая панель на всю ширину Section/PageShell) */}
        <GlassPanel className="mt-6 p-6">
          <ErrorState
            title="Не удалось загрузить список"
            message="Проверь соединение и попробуйте снова."
            onRetry={() => toast.info('Повтор запроса...')}
          />
        </GlassPanel>
      </Section>

      {/* ──────────────────────────────────────────────────────────────
          СЕКЦИЯ 2: Toolbar (липкий) + широкая контентная панель
      ─────────────────────────────────────────────────────────────── */}
      <Section y="default">
        {/* — Верхняя липкая панель инструментов */}
        <Toolbar sticky className="mb-4">
          {/* — Левая зона тулбара */}
          <div className="flex items-center gap-2">
            <span className="font-ui text-sm opacity-80">Демо Toolbar</span>
          </div>

          {/* — Правая зона тулбара */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="glass"
              onClick={() => setLoadingWide((v) => !v)}
              title="Переключить overlay у широкой панели"
            >
              {loadingWide ? 'Stop loading' : 'Simulate loading'}
            </Button>
            <Button variant="glass" onClick={() => toast.info('Action')}>Action</Button>
            <Button onClick={() => setOpen(true)}>Open modal</Button>
          </div>
        </Toolbar>

        {/* — Широкая «поверхность» (обычно: таблицы/гриды) */}
        <GlassPanel className="relative p-6">
          <div className="text-[--fg-strong] font-semibold mb-2">Широкая панель</div>
          <p className="opacity-80">
            Эта панель тянется по ширине контейнера <code>PageShell</code> (max-w по токену).
            В PROD такие блоки часто содержат гриды/таблицы.
          </p>

          {/* — Скелетоны как пример «контента в загрузке» */}
          <div className="mt-4 grid gap-3">
            <Skeleton className="h-6 w-1/3" />
            <SkeletonLines lines={3} />
          </div>

          {/* — Полупрозрачная вуаль поверх панели */}
          <LoadingOverlay show={loadingWide} />
        </GlassPanel>
      </Section>

      {/* ──────────────────────────────────────────────────────────────
          МОДАЛКА (форма)
      ─────────────────────────────────────────────────────────────── */}

      <Modal open={open} onClose={() => setOpen(false)} size="md" aria-labelledby="demo-modal-title">
        <Modal.Header onClose={() => setOpen(false)}>
          <span id="demo-modal-title" className="font-brand">Демо-модалка</span>
        </Modal.Header>

        <Modal.Body>
          {/* — Контейнер relative, чтобы накрыть форму overlay во время сохранения */}
          <div className="relative">
            <LoadingOverlay show={saving} />

            {/* — Форма внутри модалки */}
            <form className="space-y-4" onSubmit={onSave} noValidate>
              <Input
                id="name"
                label="Имя"
                placeholder="Иван"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                error={errors.name}
                variant="glass"
              />

              <Select
                id="ctype"
                label="Тип контакта"
                value={form.contactType}
                onChange={(e) => setForm((s) => ({ ...s, contactType: e.target.value }))}
                hint="Telegram предпочтительно"
                variant="glass"
              >
                <option value="telegram">Telegram</option>
                <option value="phone">Телефон</option>
                <option value="email">Email</option>
              </Select>

              <Input
                id="contact"
                label="Контакт"
                placeholder="@username или +7…"
                value={form.contact}
                onChange={(e) => setForm((s) => ({ ...s, contact: e.target.value }))}
                error={errors.contact}
                variant="glass"
              />
            </form>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="glass" onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving && <Spinner className="mr-2" />} Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ──────────────────────────────────────────────────────────────
          DRAWER (выезжающая панель)
      ─────────────────────────────────────────────────────────────── */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right" size="md">
        <Drawer.Header onClose={() => setDrawerOpen(false)}>Demo Drawer</Drawer.Header>
        <Drawer.Body>
          Выезжающая панель для навигации, фильтров или второстепенных форм.
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="glass" onClick={() => setDrawerOpen(false)}>Отмена</Button>
          <Button onClick={() => setDrawerOpen(false)}>Ок</Button>
        </Drawer.Footer>
      </Drawer>

      {/* ──────────────────────────────────────────────────────────────
          МОДАЛКА: предпросмотр ролей шрифтов
      ─────────────────────────────────────────────────────────────── */}
      <FontsModal open={fontsOpen} onClose={() => setFontsOpen(false)} />
    </PageShell>
  );
}
