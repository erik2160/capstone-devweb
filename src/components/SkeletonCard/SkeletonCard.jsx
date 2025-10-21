import React from 'react';
import './skeleton.css';

export default function SkeletonCard() {
    return (
        <article
            className="book-card card-with-footer skeleton"
            aria-hidden="true"
        >
            {}
            <div className="top">
                <div className="thumb">
                    <div className="sk-img shimmer" />
                </div>

                <div className="info">
                    <div className="sk-line sk-title shimmer" />
                    <div className="sk-line sk-title short shimmer" />

                    <div className="sk-line sk-sub shimmer" />
                    <div className="sk-line sk-sub short shimmer" />
                </div>
            </div>

            {}
            <div className="cats">
                <span className="sk-pill shimmer" />
                <span className="sk-pill shimmer" />
                <span className="sk-pill shimmer" />
                <span className="sk-pill shimmer" />
            </div>

            {}
            <div className="avail sk-footer shimmer" />
        </article>
    );
}
