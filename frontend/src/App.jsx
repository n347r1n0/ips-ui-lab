// frontend/src/App.jsx

import React, { useState } from 'react';
import { PageShell } from './ui/layout/PageShell';
import { Section } from './ui/layout/Section';
import { Toolbar } from './ui/layout/Toolbar';

import { GlassPanel } from './ui/surfaces/GlassPanel';
import { Modal } from './ui/surfaces/Modal';

import { Button } from './ui/primitives/Button';
import { Input } from './ui/primitives/Input';
import { Select } from './ui/primitives/Select';

import { Spinner } from './ui/feedback/Spinner';
import { EmptyState } from './ui/feedback/EmptyState';
import { ErrorState } from './ui/feedback/ErrorState';

import { FontsModal } from './ui/demos/FontsModal';
import { useToast } from './ui/surfaces/Toast';

import { Inbox } from 'lucide-react';

export default function App() {
  const [open, setOpen] = useState(false);
  const [fontsOpen, setFontsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', contactType: 'telegram', contact: '' });
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);

  const toast = useToast();

  const onSave = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Введите имя';
    if (!form.contact.trim()) next.contact = 'Укажите контакт';
    setErrors(next);
    if (Object.keys(next).length) {
      toast.danger(Object.values(next)[0], { title: 'Ошибка валидации' });
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      toast.success('Данные успешно сохранены!', { title: 'Успех' });
    }, 1000);
  };

  return (
    <PageShell maxW="token" padded>
      {/* Секция 1: базовые панели/кнопки/модалки */}
      <Section y="default">
        <GlassPanel className="max-w-md p-6">
          <h1 className="font-brand text-2xl font-bold text-[--fg-strong]">IPS UI Lab</h1>
          <p className="text-[--fg] opacity-80 mt-1">
            Токены, стекло, кнопки, модалки — в песочнице.
          </p>

          <div className="flex gap-2 mt-4">
            <Button>Primary</Button>
            <Button variant="glass">Cancel</Button>
            <Button variant="neutral">Neutral</Button>
            <Button onClick={() => setOpen(true)} className="ml-auto">
              Open modal
            </Button>
            <Button variant="glass" onClick={() => setFontsOpen(true)}>
              Fonts modal
            </Button>
          </div>
        </GlassPanel>

        <GlassPanel className="max-w-md p-6 mt-6">
          <div className="text-[--fg-strong] font-semibold mb-3">EmptyState demo</div>
          {items.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Пока здесь пусто"
              subtitle="Добавьте первый элемент или откройте модалки."
              action={
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setItems(['Элемент 1'])}>Добавить</Button>
                  <Button variant="glass" onClick={() => setOpen(true)}>Открыть форму</Button>
                  <Button variant="glass" onClick={() => setFontsOpen(true)}>Открыть FontsModal</Button>
                </div>
              }
            />
          ) : (
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
              </div>
            </div>
          )}
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <ErrorState
            title="Не удалось загрузить список"
            message="Проверь соединение и попробуйте снова."
            onRetry={() => toast.info('Повтор запроса...')}
          />
        </GlassPanel>
      </Section>

      {/* Секция 2: демонстрация Toolbar и широкой панели */}
      <Section y="default">
        <Toolbar sticky className="mb-4">
          <div className="flex items-center gap-2">
            <span className="font-ui text-sm opacity-80">Демо Toolbar</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="glass" onClick={() => toast.info('Action')}>
              Action
            </Button>
            <Button onClick={() => setOpen(true)}>Open modal</Button>
          </div>
        </Toolbar>

        <GlassPanel className="p-6">
          <div className="text-[--fg-strong] font-semibold mb-2">Широкая панель</div>
          <p className="opacity-80">
            Эта панель тянется по ширине контейнера <code>PageShell</code> (max-w по токену).
            В PROD такие блоки часто содержат гриды/таблицы.
          </p>
        </GlassPanel>
      </Section>

      {/* Модалка с формой */}
      <Modal open={open} onClose={() => setOpen(false)} size="md">
        <Modal.Header onClose={() => setOpen(false)}>
          <span className="font-brand">Демо-модалка</span>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="glass" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving && <Spinner className="mr-2" />} Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модалка предпросмотра ролей шрифтов */}
      <FontsModal open={fontsOpen} onClose={() => setFontsOpen(false)} />
    </PageShell>
  );
}
