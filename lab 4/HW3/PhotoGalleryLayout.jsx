import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { categories, photos } from './photos.js';
import './gallery.css';

export default function PhotoGalleryLayout() {
  const [params, setParams] = useSearchParams();
  const filterRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const closeRef = useRef(null);
  const categoryParam = params.get('category') ?? 'all';
  const category = Object.hasOwn(categories, categoryParam) ? categoryParam : 'all';
  const photoId = params.get('photoId');
  const photo = photos.find(({ id }) => id === photoId);
  const results = category === 'all' ? photos : photos.filter((item) => item.category === category);
  const slideshow = results.includes(photo) ? results : photos;
  const position = slideshow.indexOf(photo);
  const modalShown = Boolean(photo);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (modalShown && !dialog.open) {
      dialog.showModal();
      closeRef.current.focus();
    }
    if (!modalShown && dialog.open) {
      dialog.close();
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus();
      else filterRef.current.focus();
      openerRef.current = null;
    }
  }, [modalShown]);

  function photoSearch(id) {
    const search = new URLSearchParams(params);
    if (id) search.set('photoId', id);
    else search.delete('photoId');
    return search;
  }

  function closePhoto() {
    setParams(photoSearch(null), { replace: true });
  }

  function selectCategory(event) {
    const value = event.target.value;
    const search = photoSearch(null);
    if (value === 'all') search.delete('category');
    else search.set('category', value);
    setParams(search);
  }

  function stepPhoto(offset) {
    const next = (position + offset + slideshow.length) % slideshow.length;
    setParams(photoSearch(slideshow[next].id), { replace: true });
  }

  return (
    <section aria-labelledby="photo-gallery-title">
      <h2 id="photo-gallery-title">Thư viện ảnh và minh chứng</h2>
      <div className="gallery-filter">
        <label htmlFor="gallery-category">Danh mục</label>
        <select id="gallery-category" ref={filterRef} value={category} onChange={selectCategory}>
          {Object.entries(categories).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
        <p role="status">{results.length} ảnh</p>
      </div>
      {photoId && !photo && (
        <p className="error" role="alert">Không tìm thấy ảnh. <button type="button" onClick={closePhoto}>Bỏ mã ảnh</button></p>
      )}
      <ul className="photo-grid">
        {results.map((item, index) => (
          <li key={item.id}>
            <Link to={{ search: `?${photoSearch(item.id)}` }} aria-haspopup="dialog"
              onClick={(event) => {
                if (!(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) openerRef.current = event.currentTarget;
              }}>
              <img src={`/photos/${item.id}-thumb.webp`} alt={item.alt} width="480" height="320"
                decoding="async" loading={index < 3 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : undefined} />
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <dialog className="photo-dialog" ref={dialogRef} aria-labelledby="photo-dialog-title"
        onClose={() => { if (photo && !dialogRef.current.open) closePhoto(); }}
        onCancel={(event) => { event.preventDefault(); closePhoto(); }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            stepPhoto(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}>
        {photo && (
          <>
            <div className="dialog-header">
              <h3 id="photo-dialog-title">{photo.title}</h3>
              <button type="button" ref={closeRef} onClick={closePhoto}>Đóng ảnh</button>
            </div>
            <img src={`/photos/${photo.id}.webp`} alt={photo.alt} width="1120" height="750" />
            <p>{photo.description} <a href={photo.source}>Nguồn ảnh · {photo.author}</a></p>
            <div className="actions">
              <button type="button" onClick={() => stepPhoto(-1)}>Ảnh trước</button>
              <button type="button" onClick={() => stepPhoto(1)}>Ảnh tiếp</button>
              <span role="status">{position + 1}/{slideshow.length}</span>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
