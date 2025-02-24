;; Individuality Preservation Contract

(define-map identities principal
  { name: (string-utf8 64),
    traits: (list 5 (string-utf8 32)),
    active: bool })

(define-public (create-identity (name (string-utf8 64)) (traits (list 5 (string-utf8 32))))
  (ok (map-set identities tx-sender
    { name: name,
      traits: traits,
      active: true })))

(define-public (update-identity (name (string-utf8 64)) (traits (list 5 (string-utf8 32))))
  (let ((identity (unwrap! (map-get? identities tx-sender) (err u404))))
    (ok (map-set identities tx-sender
      (merge identity
        { name: name,
          traits: traits })))))

(define-public (deactivate-identity)
  (let ((identity (unwrap! (map-get? identities tx-sender) (err u404))))
    (ok (map-set identities tx-sender
      (merge identity { active: false })))))

(define-read-only (get-identity (id principal))
  (ok (map-get? identities id)))

