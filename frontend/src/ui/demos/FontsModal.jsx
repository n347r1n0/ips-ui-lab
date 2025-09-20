// frontend/src/ui/demos/FontsModal.jsx
import React from 'react';
import { Modal } from '../surfaces/Modal';
import { Button } from '../primitives/Button';

export function FontsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header onClose={onClose}>Проба шрифтов</Modal.Header>

      <Modal.Body>
        {/* BRAND — заголовок/hero */}
        <section className="mb-5">
          <div className="text-[--fg-dim] text-xs uppercase tracking-wider mb-2">BRAND</div>
          <h2 className="font-brand text-3xl text-[--fg-strong]">IPS — International Покер Style</h2>
          <p className="text-[--fg] opacity-80 mt-1">
            Заголовки и крупные акценты.
          </p>
        </section>

        {/* UI — основной текст/интерфейс */}
        <section className="mb-5">
          <div className="text-[--fg-dim] text-xs uppercase tracking-wider mb-2">UI</div>
          <p className="text-[--fg]">
            The quick brown fox Быстрая коричневая лиса
            Это main interface text: подписи полей, описания, параграфы. Роль <code className="font-mono">--font-ui</code>.
          </p>
        </section>

        {/* SERIF — цитаты/длинное чтение */}
        <section className="mb-5">
          <div className="text-[--fg-dim] text-xs uppercase tracking-wider mb-2">SERIF</div>
          <blockquote className="font-serif italic text-[--fg] bg-white/5 border border-white/10 rounded-xl p-4">
            «Терпение и расчет wins emotions побеждают эмоции».
          </blockquote>
          <p className="text-[--fg] opacity-70 mt-2 text-sm">
            Используем для цитат/литературных блоков.
          </p>
        </section>

        {/* MONO — код/идентификаторы */}
        <section>
          <div className="text-[--fg-dim] text-xs uppercase tracking-wider mb-2">MONO</div>
          <pre className="font-mono text-sm bg-black/30 border border-white/10 rounded-xl p-3 overflow-x-auto">
{`POST /api/tournaments апи/турниры АПИ/ТУРНИРЫ ВЫвы
200 OK  •  id=7f3a  •  points=1540`}
          </pre>
          <p className="text-[--fg] opacity-70 mt-2 text-sm">
            Код, идентификаторы, табличные цифры.
          </p>
        </section>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="glass" type="button" onClick={onClose}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
}
