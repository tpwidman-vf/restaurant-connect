resource "aws_lex_bot" "order_food_bot" {
    depends_on = [
      aws_lex_intent.get_food_order_intent
    ]
    child_directed                  = false
    create_version                  = false
    detect_sentiment                = false
    enable_model_improvements       = true
    idle_session_ttl_in_seconds     = 300
    locale                          = "en-US"
    name                            = "OrderIntake"
    nlu_intent_confidence_threshold = 0
    process_behavior                = "BUILD"
    voice_id                        = "Salli"

    abort_statement {
        message {
            content      = "Sorry, I could not understand. Goodbye."
            content_type = "PlainText"
        }
    }

    clarification_prompt {
        max_attempts = 5

        message {
            content      = "Sorry, can you please repeat that?"
            content_type = "PlainText"
        }
    }

    intent {
        intent_name    = "CheckOrderStatus"
        intent_version = "$LATEST"
    }
    intent {
        intent_name    = "GetFoodOrder"
        intent_version = "$LATEST"
    }
    intent {
        intent_name = "CustomerServiceRepIntent"
        intent_version = "$LATEST"
    }

}

resource "aws_lex_bot_alias" "order_intake_connect" {
    depends_on = [
      aws_lex_bot.order_food_bot
    ]
  bot_name    = "OrderIntake"
  bot_version = aws_lex_bot.order_food_bot.version
  description = "Version of the OrderIntake bot to be used by a Connect instance. This protects against changes to $LATEST."
  name        = "OrderIntakeConnect"
}

output "bot_arn" {
    value = aws_lex_bot.order_food_bot.arn
}

resource "aws_lex_bot" "yes_no_bot" {
    depends_on = [
        aws_lex_intent.confirm_intent, aws_lex_intent.reject_intent
    ]
    child_directed                  = false
    create_version                  = false
    detect_sentiment                = false
    enable_model_improvements       = true
    idle_session_ttl_in_seconds     = 300
    locale                          = "en-US"
    name                            = "YesNoBot"
    nlu_intent_confidence_threshold = 0.8
    process_behavior                = "BUILD"
    voice_id                        = "Salli"

    abort_statement {
        message {
            content      = "Okay."
            content_type = "PlainText"
        }
    }

    clarification_prompt {
        max_attempts = 5

        message {
            content      = "Are you calling about a previous order? You could say yes for an order status or no to place a new order."
            content_type = "PlainText"
        }
    }

    intent {
        intent_name    = "ConfirmIntent"
        intent_version = "$LATEST"
    }
    intent {
        intent_name    = "RejectIntent"
        intent_version = "$LATEST"
    }
    intent {
        intent_name = "CancelOrderIntent"
        intent_version = "$LATEST"
    }

}

resource "aws_lex_bot_alias" "yes_no_connect" {
    depends_on = [
      aws_lex_bot.yes_no_bot
    ]
  bot_name    = "YesNoBot"
  bot_version = aws_lex_bot.yes_no_bot.version
  description = "Version of the YesNoBot to be used by a Connect instance. This protects against changes to $LATEST."
  name        = "YesNoConnect"
}

output "yes_no_bot_arn" {
    value = aws_lex_bot.yes_no_bot.arn
}