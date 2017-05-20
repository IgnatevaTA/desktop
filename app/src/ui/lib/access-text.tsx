import * as React from 'react'
import * as classNames from 'classnames'

interface IAccessTextProps {
  /**
   * A string which optionally contains an access key modifier (ampersand).
   * The access key modifier directly precedes the character which is
   * highlighted when the highlight property is set. Literal ampersand
   * characters need to be escaped by using two ampersand characters (&&).
   *
   * At most one character is allowed to have a preceeding ampersand character.
   */
  readonly text: string,

  /**
   * Whether or not to highlight the access key (if one exists).
   */
  readonly highlight?: boolean,
}

/**
 * A platform helper function which optionally highlights access keys (letters
 * prefixed with &) on Windows. On non-Windows platform access key prefixes
 * are removed before rendering.
 */
export class AccessText extends React.Component<IAccessTextProps, void> {
  public shouldComponentUpdate(nextProps: IAccessTextProps) {
    return this.props.text !== nextProps.text ||
      this.props.highlight !== nextProps.highlight
  }

  public render() {

    // Match everything (if anything) before an ampersand followed by anything that's
    // not an ampersand and then capture the remainder.
    const m = this.props.text.match(/^(.*?)?(?:&([^&]))(.*)?$/)

    if (!m) {
      return <span>{this.props.text}</span>
    }

    const elements = new Array<JSX.Element>()

    if (m[1]) {
      elements.push(<span key={1}>{m[1].replace('&&', '&')}</span>)
    }

    const className = classNames(
      'access-key',
      { highlight: this.props.highlight },
    )

    elements.push(<span key={2} className={className}>{m[2]}</span>)

    if (m[3]) {
      elements.push(<span key={3}>{m[3].replace('&&', '&')}</span>)
    }

    return <span>{elements}</span>
  }
}
