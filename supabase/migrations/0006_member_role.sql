-- ============================================================================
-- GameXchange · 0006 unified member role
-- ============================================================================
-- Every person now uses one account category: `member`. Members can buy,
-- sell, list, bid and open support tickets from the same profile. Admin roles
-- (`super_admin`, `moderator`) stay separate.
--
-- IMPORTANT: this migration intentionally contains ONLY the enum change.
-- PostgreSQL will not let the new enum value be used in the same transaction
-- that adds it, so the default/back-fill follows in 0007_bid_deposits.sql.
-- ============================================================================

alter type user_role add value if not exists 'member';
