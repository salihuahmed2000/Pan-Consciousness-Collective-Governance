;; Cognitive Consensus Mechanism Contract

(define-map proposals uint
  { description: (string-utf8 256),
    votes-for: uint,
    votes-against: uint })

(define-data-var next-proposal-id uint u0)

(define-public (create-proposal (description (string-utf8 256)))
  (let ((new-id (+ (var-get next-proposal-id) u1)))
    (var-set next-proposal-id new-id)
    (map-set proposals new-id
      { description: description,
        votes-for: u0,
        votes-against: u0 })
    (ok new-id)))

(define-public (vote (proposal-id uint) (vote-for bool))
  (let ((proposal (unwrap! (map-get? proposals proposal-id) (err u404))))
    (if vote-for
      (map-set proposals proposal-id
        (merge proposal { votes-for: (+ (get votes-for proposal) u1) }))
      (map-set proposals proposal-id
        (merge proposal { votes-against: (+ (get votes-against proposal) u1) })))
    (ok true)))

(define-read-only (get-proposal (id uint))
  (ok (map-get? proposals id)))

